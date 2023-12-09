package trombitasp.ReservationManager.controller

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*
import trombitasp.ReservationManager.model.User
import trombitasp.ReservationManager.repository.UserRepository
import trombitasp.ReservationManager.security.services.UserDetailsImpl

@RestController
@RequestMapping("/api")
@CrossOrigin
class UserController(private val userRepository: UserRepository) {

    @GetMapping("/users")
    fun findAllUser() = userRepository.findAll()

    @GetMapping("/users/{id}")
    fun findUserById(@PathVariable id: Int): ResponseEntity<User> {
        return userRepository.findById(id).map { u ->
            ResponseEntity.ok(u)
        }.orElse(ResponseEntity.notFound().build())
    }

    @GetMapping("/users/{name}/{role}/")
    fun findAllUserByName(@PathVariable name: String, @PathVariable role: String) = userRepository.findAll(name, role)

    @PutMapping("/users/{id}")
    @PreAuthorize("hasAuthority('LOGGED_IN') or hasAuthority('ADMIN')")
    fun updateUser(@PathVariable id: Int, @RequestBody user: User, authentication: Authentication): ResponseEntity<User> {
        val userPrincipal = authentication.principal as UserDetailsImpl
        if (userPrincipal.id != user.id) {  // ha nem egyeznek meg, akkor a bejelentkezett felh. nem a saját profilját akarja szerkeszteni, hanem másét
            println("A user tried to edit another users profile!")
            return ResponseEntity.badRequest().build()
        }
        return userRepository.findById(id).map { existingUser ->
            val updatedUser: User = existingUser.clone(/*username = user.username, roles = user.roles, email = user.email, password = user.password*/)
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