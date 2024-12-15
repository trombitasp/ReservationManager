package trombitasp.ReservationManager

import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.ninjasquad.springmockk.MockkBean
import io.mockk.Runs
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.springframework.http.MediaType
import io.mockk.every
import io.mockk.just
import io.mockk.verify
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.*
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart
import trombitasp.ReservationManager.email.EmailSenderService
import trombitasp.ReservationManager.model.Reservation
import trombitasp.ReservationManager.model.Resource
import trombitasp.ReservationManager.model.ResourceProvider
import trombitasp.ReservationManager.model.User
import trombitasp.ReservationManager.payload.response.MessageResponse
import trombitasp.ReservationManager.repository.*
import trombitasp.ReservationManager.security.services.UserDetailsImpl
import java.util.*


@SpringBootTest
@ActiveProfiles("integration")
@AutoConfigureMockMvc
class ReservationManagerIntegrationTests {
    @Autowired private lateinit var mvc: MockMvc
    private val mapper = jacksonObjectMapper().findAndRegisterModules()

    @MockkBean
    private lateinit var emailSenderService: EmailSenderService

    @Autowired
    private lateinit var reservationRepo: ReservationRepository
    @Autowired
    private lateinit var resourceProviderRepo: ResourceProviderRepository
    @Autowired
    private lateinit var resourceRepo: ResourceRepository
    @Autowired
    private lateinit var userRepo: UserRepository

    @BeforeEach
    fun initialize() {
        every { emailSenderService.sendSimpleEmail(any(), any(), any()) } just Runs

        reservationRepo.deleteAll()
        resourceProviderRepo.deleteAll()
        resourceRepo.deleteAll()
        userRepo.deleteAll()
    }

    @Test
    fun `findAllReservation() returns an empty list when no reservations exist`() {
        val response = mvc.get("/api/reservations")
            .andExpect { status { isOk() } }
            .andReturn().response.contentAsString

        val reservations = mapper.readValue(response, List::class.java)
        Assertions.assertEquals(0, reservations.size)
    }

    @Test
    fun `findAllReservation() returns a list of reservations`() {
        reservationRepo.save(
            testReservation()
        )
        val response = mvc.get("/api/reservations")
            .andExpect { status { isOk() } }
            .andReturn().response.contentAsString

        val reservations = mapper.readValue(response, List::class.java)
        Assertions.assertEquals(1, reservations.size)
    }

    @Test
    fun `saveReservation() creates a new reservation and sends email`() {
        val reservation = testReservation()
        reservationRepo.save(reservation)

        val response = mvc.post("/api/reservations") {
            contentType = MediaType.APPLICATION_JSON
            content = mapper.writeValueAsString(reservation)
        }.andExpect { status { isOk() } }
            .andReturn().response.contentAsString

        val savedReservation = mapper.readValue(response, Reservation::class.java)

        Assertions.assertNotNull(savedReservation.id)
        verify(exactly = 1) { emailSenderService.sendSimpleEmail(any(), any(), any()) }
    }

    @Test
    fun `updateReservation() updates an existing reservation`() {
        val reservation = testReservation()
        reservationRepo.save(reservation)
        val updatedReservation = reservation.copy(description = "Updated description")

        mvc.put("/api/reservations/${reservation.id}") {
            contentType = MediaType.APPLICATION_JSON
            content = mapper.writeValueAsString(updatedReservation)
        }.andExpect { status { isOk() } }
        val updated = reservationRepo.findById(reservation.id).get()

        Assertions.assertEquals("Updated description", updated.description)
    }

    @Test
    fun `deleteReservationById() deletes the reservation and sends email`() {
        val reservation = testReservation()
        reservationRepo.save(reservation)

        mvc.delete("/api/reservations/${reservation.id}")
            .andExpect { status { isOk() } }

        Assertions.assertFalse(reservationRepo.findById(reservation.id).isPresent)
        verify(exactly = 1) { emailSenderService.sendSimpleEmail(any(), any(), any()) }
    }

    @Test
    fun `login successful with valid admin credentials`() {
        val request = testUser()
        val response = mvc
            .post("/login") {
                contentType = MediaType.APPLICATION_JSON
                content = mapper.writeValueAsString(request)
            }
            .andExpect { status { isOk() } }
            .andReturn().response.contentAsString

        val dto = mapper.readValue(response, MessageResponse::class.java)
        Assertions.assertNotEquals("", dto.message)
    }

    @Test
    fun `login unsuccessful with invalid password`() {
        val request = testUser()
        mvc
            .post("/login") {
                contentType = MediaType.APPLICATION_JSON
                content = mapper.writeValueAsString(request)
            }
            .andExpect { status { isBadRequest() } }
    }

    @Test
    fun `login unsuccessful with invalid username`() {
        val request = testUser()
        mvc
            .post("/login") {
                contentType = MediaType.APPLICATION_JSON
                content = mapper.writeValueAsString(request)
            }
            .andExpect { status { isBadRequest() } }
    }

    @Test
    fun `validate successful with valid token`() {
        val request = testUser()
        val loginResponse = mvc
            .post("/login") {
                contentType = MediaType.APPLICATION_JSON
                content = mapper.writeValueAsString(request)
            }
            .andExpect { status { isOk() } }
            .andReturn().response.contentAsString

        val validateRequest = mapper.readValue(loginResponse, MessageResponse::class.java)
        val validateResponse = mvc
            .post("/validate") {
                contentType = MediaType.APPLICATION_JSON
                content = mapper.writeValueAsString(validateRequest)
            }
            .andExpect { status { isOk() } }
            .andReturn().response.contentAsString
        val dto = mapper.readValue(validateResponse, MessageResponse::class.java)
        Assertions.assertEquals("", dto.message)
    }

    @Test
    fun `validate unsuccessful with invalid token`() {
        val request = testUser()
        val response = mvc
            .post("/validate") {
                contentType = MediaType.APPLICATION_JSON
                content = mapper.writeValueAsString(request)
            }
            .andExpect { status { isOk() } }
            .andReturn().response.contentAsString
        val dto = mapper.readValue(response, MessageResponse::class.java)
        Assertions.assertEquals("", dto.message)
    }

    @Test
    fun `findAllResource() returns an empty list when no resources exist`() {
        val response = mvc.get("/api/resources")
            .andExpect { status { isOk() } }
            .andReturn().response.contentAsString

        val resources = mapper.readValue(response, List::class.java)

        Assertions.assertEquals(0, resources.size)
    }

    @Test
    fun `findAllResource() returns a list of resources`() {
        resourceRepo.save(testResource())

        val response = mvc.get("/api/resources")
            .andExpect { status { isOk() } }
            .andReturn().response.contentAsString

        val resources = mapper.readValue(response, List::class.java)
        Assertions.assertEquals(1, resources.size)
    }

    @Test
    fun `findResourceById() returns resource when found`() {
        val resource = resourceRepo.save(testResource())

        val response = mvc.get("/api/resources/${resource.id}")
            .andExpect { status { isOk() } }
            .andReturn().response.contentAsString

        val retrievedResource = mapper.readValue(response, Resource::class.java)
        Assertions.assertEquals(resource.name, retrievedResource.name)
    }

    @Test
    fun `findResourceById() returns 404 when resource not found`() {
        mvc.get("/api/resources/999")
            .andExpect { status { isNotFound() } }
    }

    @Test
    fun `findAllResourceByName() filters resources based on criteria`() {
        resourceRepo.save(testResource())

        val response = mvc.get("/api/resources/Filtered Resource/test-provider-id/Filtered Description/")
            .andExpect { status { isOk() } }
            .andReturn().response.contentAsString

        val resources = mapper.readValue(response, List::class.java)
        Assertions.assertEquals(1, resources.size)
    }

    @Test
    fun `saveResource() creates a new resource`() {
        val resource = testResource()

        val response = mvc.post("/api/resources") {
            contentType = MediaType.APPLICATION_JSON
            content = mapper.writeValueAsString(resource)
        }.andExpect { status { isOk() } }
            .andReturn().response.contentAsString

        val savedResource = mapper.readValue(response, Resource::class.java)

        Assertions.assertNotNull(savedResource.id)
        Assertions.assertEquals(resource.name, savedResource.name)
    }

    @Test
    fun `updateResource() updates an existing resource`() {
        val savedResource = resourceRepo.save(testResource())

        val updatedResource = savedResource.copy(
            name = "Updated Resource",
            description = "Updated Description"
        )
        val response = mvc.put("/api/resources/${savedResource.id}") {
            contentType = MediaType.APPLICATION_JSON
            content = mapper.writeValueAsString(updatedResource)
        }.andExpect { status { isOk() } }
            .andReturn().response.contentAsString

        val updated = mapper.readValue(response, Resource::class.java)
        Assertions.assertEquals("Updated Resource", updated.name)
    }

    @Test
    fun `updateResource() returns 404 when resource does not exist`() {
        val updatedResource = testResource()

        mvc.put("/api/resources/999") {
            contentType = MediaType.APPLICATION_JSON
            content = mapper.writeValueAsString(updatedResource)
        }.andExpect { status { isNotFound() } }
    }

    @Test
    fun `deleteResourceById() deletes the resource`() {
        val resource = resourceRepo.save(testResource())

        mvc.delete("/api/resources/${resource.id}")
            .andExpect { status { isOk() } }

        Assertions.assertFalse(resourceRepo.findById(resource.id).isPresent)
    }

    @Test
    fun `deleteResourceById() returns 404 when resource does not exist`() {
        mvc.delete("/api/resources/999")
            .andExpect { status { isNotFound() } }
    }

    @Test
    fun `findAllResourceProvider() returns an empty list when no providers exist`() {
        val response = mvc.get("/api/resourceproviders")
            .andExpect { status { isOk() } }
            .andReturn().response.contentAsString

        val providers = mapper.readValue(response, List::class.java)
        Assertions.assertEquals(0, providers.size)
    }

    @Test
    fun `findAllResourceProvider() returns a list of providers`() {
        resourceProviderRepo.save(testResourceProvider())

        val response = mvc.get("/api/resourceproviders")
            .andExpect { status { isOk() } }
            .andReturn().response.contentAsString

        val providers = mapper.readValue(response, List::class.java)
        Assertions.assertEquals(1, providers.size)
    }

    @Test
    fun `findResourceProviderById() returns provider when found`() {
        val provider = resourceProviderRepo.save(testResourceProvider())

        val response = mvc.get("/api/resourceproviders/${provider.id}")
            .andExpect { status { isOk() } }
            .andReturn().response.contentAsString

        val retrievedProvider = mapper.readValue(response, ResourceProvider::class.java)
        Assertions.assertEquals(provider.name, retrievedProvider.name)
    }

    @Test
    fun `findResourceProviderById() returns 404 when provider not found`() {
        mvc.get("/api/resourceproviders/999")
            .andExpect { status { isNotFound() } }
    }

    @Test
    fun `getProductImage() returns image if provider exists`() {
        val provider = resourceProviderRepo.save(testResourceProvider())

        val response = mvc.get("/api/resourceproviders/${provider.id}/image")
            .andExpect { status { isOk() } }
            .andReturn().response.contentAsByteArray

        Assertions.assertArrayEquals("test-image".toByteArray(), Base64.getDecoder().decode(response))
    }

    @Test
    fun `getProductImage() returns 404 if provider not found`() {
        mvc.get("/api/resourceproviders/999/image")
            .andExpect { status { isNotFound() } }
    }

    @Test
    fun `saveResourceProvider() creates a new provider`() {
        val provider = testResourceProvider()

        val response = mvc.post("/api/resourceproviders") {
            contentType = MediaType.APPLICATION_JSON
            content = mapper.writeValueAsString(provider)
        }.andExpect { status { isOk() } }
            .andReturn().response.contentAsString

        val savedProvider = mapper.readValue(response, ResourceProvider::class.java)

        Assertions.assertNotNull(savedProvider.id)
        Assertions.assertEquals(provider.name, savedProvider.name)
    }

    @Test
    fun `deleteResourceProviderById() deletes the provider`() {
        val provider = resourceProviderRepo.save(testResourceProvider())

        mvc.delete("/api/resourceproviders/${provider.id}")
            .andExpect { status { isOk() } }

        Assertions.assertFalse(resourceProviderRepo.findById(provider.id).isPresent)
    }

    @Test
    fun `deleteResourceProviderById() returns 404 when provider does not exist`() {
        mvc.delete("/api/resourceproviders/999")
            .andExpect { status { isNotFound() } }
    }

    @Test
    fun `findAllUser() returns an empty list when no users exist`() {
        val response = mvc.get("/api/users")
            .andExpect { status { isOk() } }
            .andReturn().response.contentAsString

        val users = mapper.readValue(response, List::class.java)

        Assertions.assertTrue(users.isEmpty())
    }

    @Test
    fun `findAllUser() returns a list of users`() {
        userRepo.save(testUser())

        val response = mvc.get("/api/users")
            .andExpect { status { isOk() } }
            .andReturn().response.contentAsString

        val users = mapper.readValue(response, List::class.java)
        Assertions.assertEquals(1, users.size)
    }

    @Test
    fun `findUserById() returns user when found`() {
        val user = userRepo.save(testUser())

        val response = mvc.get("/api/users/${user.id}")
            .andExpect { status { isOk() } }
            .andReturn().response.contentAsString

        val retrievedUser = mapper.readValue(response, User::class.java)
        Assertions.assertEquals(user.username, retrievedUser.username)
    }

    @Test
    fun `findUserById() returns 404 when user not found`() {
        mvc.get("/api/users/999")
            .andExpect { status { isNotFound() } }
    }

    @Test
    fun `findAllUserByName() returns users matching the name and role`() {
        userRepo.save(testUser())

        val response = mvc.get("/api/users/admin/admin/")
            .andExpect { status { isOk() } }
            .andReturn().response.contentAsString

        val users = mapper.readValue(response, List::class.java)
        Assertions.assertEquals(1, users.size)
    }

    @Test
    fun `updateUser() updates user when authenticated user matches`() {
        val user = userRepo.save(testUser())

        val authentication = SecurityContextHolder.getContext().authentication
        (authentication.principal as UserDetailsImpl).id = user.id!!

        user.username = "updatedUser"

        val response = mvc.put("/api/users/${user.id}") {
            contentType = MediaType.APPLICATION_JSON
            content = mapper.writeValueAsString(user)
        }.andExpect { status { isOk() } }
            .andReturn().response.contentAsString

        val savedUser = mapper.readValue(response, User::class.java)
        Assertions.assertEquals("updatedUser", savedUser.username)
    }

    @Test
    fun `updateUser() returns 404 when user not found`() {
        val user = testUser()

        mvc.put("/api/users/999") {
            contentType = MediaType.APPLICATION_JSON
            content = mapper.writeValueAsString(user)
        }.andExpect { status { isNotFound() } }
    }

    @Test
    fun `deleteUserById() deletes the user`() {
        val user = userRepo.save(testUser())

        mvc.delete("/api/users/${user.id}")
            .andExpect { status { isOk() } }

        Assertions.assertFalse(userRepo.findById(user.id!!).isPresent)
    }

    @Test
    fun `deleteUserById() returns 404 when user not found`() {
        mvc.delete("/api/users/999")
            .andExpect { status { isNotFound() } }
    }

    private fun testResourceProvider() = ResourceProvider(
        name = "Test Provider",
        email = "provider@example.com",
        id = 0,
        image = ""
    )

    private fun testUser() = User(
        username = "admin",
        email = "user@example.com",
        password = "admin"
    )

    private fun testResource() = Resource(
        name = "Test Resource",
        resourceProvider = testResourceProvider(),
        description = "test resource",
        id = 0
    )

    private fun testReservation() =  Reservation(
        user = testUser(),
        resource = testResource(),
        beginningOfReservation = Date(),
        endOfReservation = Date(),
        description = "Test reservation",
        id = 0
    )
}
