package trombitasp.ReservationManager.controller

import jakarta.validation.Valid
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.*
import trombitasp.ReservationManager.model.ERole
import trombitasp.ReservationManager.model.Role
import trombitasp.ReservationManager.model.User
import trombitasp.ReservationManager.payload.request.LoginRequest
import trombitasp.ReservationManager.payload.request.SignupRequest
import trombitasp.ReservationManager.payload.response.JwtResponse
import trombitasp.ReservationManager.payload.response.MessageResponse
import trombitasp.ReservationManager.repository.RoleRepository
import trombitasp.ReservationManager.repository.UserRepository
import trombitasp.ReservationManager.security.jwt.JwtUtils
import trombitasp.ReservationManager.security.services.UserDetailsImpl
import java.util.function.Consumer
import java.util.stream.Collectors


@CrossOrigin(origins = ["*"])
@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val authenticationManager: AuthenticationManager,
    private val userRepository: UserRepository,
    private val roleRepository: RoleRepository,
    private val encoder: PasswordEncoder,
    private val jwtUtils: JwtUtils
) {
    /*@Autowired
    var authenticationManager: AuthenticationManager? = null

    @Autowired
    var userRepository: UserRepository? = null

    @Autowired
    var roleRepository: RoleRepository? = null

    @Autowired
    var encoder: PasswordEncoder? = null

    @Autowired
    var jwtUtils: JwtUtils? = null*/
    @PostMapping("/signin")
    fun authenticateUser(@Valid @RequestBody loginRequest: LoginRequest): ResponseEntity<*> {
        val authentication: Authentication = authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(loginRequest.username, loginRequest.password)
        )
        SecurityContextHolder.getContext().authentication = authentication
        val jwt = jwtUtils.generateJwtToken(authentication)
        val userDetails = authentication.principal as UserDetailsImpl
        val roles: List<String> = userDetails.authorities.stream()
            .map { item: GrantedAuthority -> item.authority }
            .collect(Collectors.toList())

        return ResponseEntity.ok<Any>(
            JwtResponse(
                jwt,
                userDetails.id,
                userDetails.username,
                userDetails.email,
                roles
            )
        )
    }

    @PostMapping("/signup")
    fun registerUser(@Valid @RequestBody signUpRequest: SignupRequest): ResponseEntity<*> {
        if (userRepository.existsByUsername(signUpRequest.username)) {
            return ResponseEntity
                .badRequest()
                .body<Any>(MessageResponse("Hiba: A felhasználónév már foglalt!"))
        }
        if (userRepository.existsByEmail(signUpRequest.email)) {
            return ResponseEntity
                .badRequest()
                .body<Any>(MessageResponse("Hiba: Az email cím már foglalt!"))
        }

        // Create new user's account
        val user = User(
            signUpRequest.username,
            signUpRequest.email,
            encoder.encode(signUpRequest.password)
        )
        val strRoles: Set<String> = signUpRequest.role
        val roles: MutableSet<Role> = HashSet()
        if (strRoles.isEmpty()) {
            val userRole = roleRepository.findByName(ERole.DEFAULT)
                ?: throw RuntimeException("Hiba: A megadott felhasználói jog nem létezik.")
            roles.add(userRole)
        } else {
            strRoles.forEach(Consumer { role: String? ->
                when (role) {
                    "admin", "ADMIN" -> {
                        val adminRole: Role = roleRepository.findByName(ERole.ADMIN)
                            ?: throw RuntimeException("Hiba: A megadott felhasználói jog nem létezik.")
                        roles.add(adminRole)
                    }

                    "logged_in", "LOGGED_IN" -> {
                        val modRole: Role = roleRepository.findByName(ERole.LOGGED_IN)
                            ?: throw RuntimeException("Hiba: A megadott felhasználói jog nem létezik.")
                        roles.add(modRole)
                    }

                    else -> {
                        val userRole: Role = roleRepository.findByName(ERole.DEFAULT)
                            ?: throw RuntimeException("Hiba: A megadott felhasználói jog nem létezik.")
                        roles.add(userRole)
                    }
                }
            })
        }
        user.roles = roles
        userRepository.save<User>(user)
        return ResponseEntity.ok<Any>(MessageResponse("A felhasználó sikeresen regisztrálva lett!"))
    }
}