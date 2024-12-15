package trombitasp.reservation_manager_payments

import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.web.servlet.MockMvc


@SpringBootTest
@AutoConfigureMockMvc
class ReservationManagerPaymentsIntegrationTests {

    @Autowired
    private lateinit var mvc: MockMvc

    @Autowired
    private lateinit var paymentRepository: PaymentRepository

    private val mapper = jacksonObjectMapper().findAndRegisterModules()

    @BeforeEach
    fun setup() {
        paymentRepository.deleteAll()
    }

    @Test
    fun `findAllPayment() returns an empty list when no payments exist`() {
        val response = mvc.get("/api/payments/")
            .andExpect { status { isOk() } }
            .andReturn().response.contentAsString

        val payments = mapper.readValue(response, List::class.java)
        Assertions.assertTrue(payments.isEmpty())
    }

    @Test
    fun `findAllPayment() returns a list of payments`() {
        paymentRepository.save(Payment(havePayed = true))

        val response = mvc.get("/api/payments/")
            .andExpect { status { isOk() } }
            .andReturn().response.contentAsString
        val payments = mapper.readValue(response, List::class.java)
        Assertions.assertEquals(1, payments.size)
    }

    @Test
    fun `findPaymentById() returns payment when found`() {
        val payment = paymentRepository.save(Payment(havePayed = true))

        val response = mvc.get("/api/payments/${payment.id}")
            .andExpect { status { isOk() } }
            .andReturn().response.contentAsString

        val retrievedPayment = mapper.readValue(response, Payment::class.java)
        Assertions.assertEquals(payment.id, retrievedPayment.id)
    }

    @Test
    fun `findPaymentById() returns 404 when payment not found`() {
        mvc.get("/api/payments/999")
            .andExpect { status { isNotFound() } }
    }

    @Test
    fun `savePayment() creates a new payment`() {
        val payment = Payment(havePayed = false)

        val response = mvc.post("/api/payments/") {
            contentType = MediaType.APPLICATION_JSON
            content = mapper.writeValueAsString(payment)
        }.andExpect { status { isOk() } }
            .andReturn().response.contentAsString

        val savedPayment = mapper.readValue(response, Payment::class.java)

        Assertions.assertNotNull(savedPayment.id)
        Assertions.assertEquals(payment.havePayed, savedPayment.havePayed)
    }

    @Test
    fun `updatePayment() updates payment when found`() {
        val payment = paymentRepository.save(Payment(havePayed = false))
        val updatedPayment = payment.copy(havePayed = true)
        val response = mvc.put("/api/payments/${payment.id}") {
            contentType = MediaType.APPLICATION_JSON
            content = mapper.writeValueAsString(updatedPayment)
        }.andExpect { status { isOk() } }
            .andReturn().response.contentAsString

        val savedPayment = mapper.readValue(response, Payment::class.java)
        Assertions.assertEquals(payment.id, savedPayment.id)
        Assertions.assertTrue(savedPayment.havePayed)
    }

    @Test
    fun `updatePayment() returns 404 when payment not found`() {
        val payment = Payment(id = 999, havePayed = true)

        mvc.put("/api/payments/999") {
            contentType = MediaType.APPLICATION_JSON
            content = mapper.writeValueAsString(payment)
        }.andExpect { status { isNotFound() } }
    }
}