package trombitasp.ReservationManager

import jakarta.persistence.EntityManager
import jakarta.persistence.TypedQuery
import jakarta.persistence.criteria.CriteriaBuilder
import jakarta.persistence.criteria.CriteriaQuery
import jakarta.persistence.criteria.Root
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.junit.jupiter.MockitoExtension
import org.springframework.boot.test.context.SpringBootTest
import java.util.*
import kotlin.test.assertEquals

@SpringBootTest
@ExtendWith(MockitoExtension::class)
class ReservationManagerApplicationTests {

	@Mock
	private lateinit var entityManager: EntityManager

	@Mock
	private lateinit var criteriaBuilder: CriteriaBuilder

	@Mock
	private lateinit var criteriaQuery: CriteriaQuery<User>

	@Mock
	private lateinit var root: Root<User>

	@Mock
	private lateinit var typedQuery: TypedQuery<User>

	@InjectMocks
	private lateinit var userRepositoryImpl: UserRepositoryImpl

	@BeforeEach
	fun setUp() {
		userRepositoryImpl.em = entityManager
		Mockito.`when`(entityManager.criteriaBuilder).thenReturn(criteriaBuilder)
		Mockito.`when`(criteriaBuilder.createQuery(User::class.java)).thenReturn(criteriaQuery)
		Mockito.`when`(criteriaQuery.from(User::class.java)).thenReturn(root)
	}

	@Test
	fun `should return users when only name is provided`() {
		val name = "John"
		val userList = listOf(User(1, "John", listOf(Role(1, "USER"))))

		Mockito.`when`(entityManager.createQuery(criteriaQuery)).thenReturn(typedQuery)
		Mockito.`when`(typedQuery.resultList).thenReturn(userList)

		val result = userRepositoryImpl.findAll(name, null)

		assertEquals(userList, result)
	}

	@Test
	fun `should return users when only role is provided`() {
		val role = "ADMIN"
		val userList = listOf(User(2, "Jane", listOf(Role(2, "ADMIN"))))

		Mockito.`when`(entityManager.createQuery(criteriaQuery)).thenReturn(typedQuery)
		Mockito.`when`(typedQuery.resultList).thenReturn(userList)

		val result = userRepositoryImpl.findAll(null, role)

		assertEquals(userList, result)
	}

	@Test
	fun `should return empty list when no users match`() {
		val name = "NonExistent"

		Mockito.`when`(entityManager.createQuery(criteriaQuery)).thenReturn(typedQuery)
		Mockito.`when`(typedQuery.resultList).thenReturn(emptyList())

		val result = userRepositoryImpl.findAll(name, null)

		assertEquals(emptyList<User>(), result)
	}

	@Test
	fun `should handle both name and role filters`() {
		val name = "John"
		val role = "USER"
		val userList = listOf(User(1, "John", listOf(Role(1, "USER"))))

		Mockito.`when`(entityManager.createQuery(criteriaQuery)).thenReturn(typedQuery)
		Mockito.`when`(typedQuery.resultList).thenReturn(userList)

		val result = userRepositoryImpl.findAll(name, role)

		assertEquals(userList, result)
	}

}
