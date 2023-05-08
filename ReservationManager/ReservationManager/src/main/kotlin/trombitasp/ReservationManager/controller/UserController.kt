package trombitasp.ReservationManager.controller

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import trombitasp.ReservationManager.model.User
import trombitasp.ReservationManager.repository.UserRepository

@RestController
@RequestMapping("/api")
class UserController(private val userRepository: UserRepository) {

    @GetMapping("/users")
    fun findAllUser() = userRepository.findAll()

    @GetMapping("/users/{id}")
    fun findUserById(@PathVariable id: Int): ResponseEntity<User> {
        return userRepository.findById(id).map { u ->
            ResponseEntity.ok(u)
        }.orElse(ResponseEntity.notFound().build())
    }

    @GetMapping("/users/byname/{name}")
    fun findAllUserByName(@PathVariable name: String) = userRepository.findAllByName(name)

    @GetMapping("/users/byrole/{role}")
    fun findAllUserByRole(@PathVariable role: String) = userRepository.findAllByRole(role)

    @PostMapping("/users")
    fun saveUser(@RequestBody user: User) = userRepository.save(user)

    @PutMapping("/users/{id}")
    fun updateUser(@PathVariable id: Int, @RequestBody user: User): ResponseEntity<User> {
        return userRepository.findById(id).map { existingUser ->
            val updatedUser: User = existingUser.copy(name = user.name, role = user.role, /*reservations = user.reservations*/)
            ResponseEntity.ok().body(userRepository.save(updatedUser))
        }.orElse(ResponseEntity.notFound().build())
    }

    @DeleteMapping("/users/{id}")
    fun deleteUserById(@PathVariable id: Int): ResponseEntity<Void> {
        return userRepository.findById(id).map { r  ->
            userRepository.delete(r)
            ResponseEntity<Void>(HttpStatus.OK)
        }.orElse(ResponseEntity.notFound().build())
    }
}