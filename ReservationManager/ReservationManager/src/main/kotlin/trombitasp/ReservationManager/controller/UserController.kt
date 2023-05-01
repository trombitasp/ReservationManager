package trombitasp.ReservationManager.controller

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import trombitasp.ReservationManager.model.User
import trombitasp.ReservationManager.repository.UserRepository

@RestController
@RequestMapping("/api")
class UserController(val userRepository: UserRepository) {

    @GetMapping("/users")
    fun findAll() = userRepository.findAll()

    @GetMapping("/users/{id}")
    fun findById(@PathVariable id: Int): ResponseEntity<User> {
        return userRepository.findById(id).map { u ->
            ResponseEntity.ok(u)
        }.orElse(ResponseEntity.notFound().build())
    }

    @GetMapping("/users/byname/{name}")
    fun findAllByName(@PathVariable name: String) = userRepository.findAllByName(name)

    @GetMapping("/users/byrole/{role}")
    fun findallByRole(@PathVariable role: String) = userRepository.findAllByRole(role)

    @PostMapping("/users")
    fun saveUser(@RequestBody user: User) = userRepository.save(user)

    @PutMapping("/users/{id}")
    fun updateUser(@PathVariable id: Int, @RequestBody user: User): ResponseEntity<User> {
        return userRepository.findById(id).map { existingUser ->
            val updatedUser: User = existingUser.copy(name = user.name, role = user.role, reservations = user.reservations)
            ResponseEntity.ok().body(userRepository.save(updatedUser))
        }.orElse(ResponseEntity.notFound().build())
    }

    @DeleteMapping("/articles/{id}")
    fun deleteUserById(@PathVariable id: Int): ResponseEntity<Void> {
        return userRepository.findById(id).map { article  ->
            userRepository.delete(article)
            ResponseEntity<Void>(HttpStatus.OK)
        }.orElse(ResponseEntity.notFound().build())
    }
}