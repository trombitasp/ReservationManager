package trombitasp.ReservationManager.security.services

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import trombitasp.ReservationManager.model.User
import trombitasp.ReservationManager.repository.UserRepository


@Service
class UserDetailsServiceImpl(
    private val userRepository: UserRepository
) : UserDetailsService {
//    @Autowired
//    var userRepository: UserRepository? = null

    @Transactional
    @Throws(UsernameNotFoundException::class)
    override fun loadUserByUsername(username: String): UserDetails {
        val user = userRepository.findByUsername(username)
        if (user != null) {
            return UserDetailsImpl.build(user)
        } else {
            throw UsernameNotFoundException("Nincs ilyen nevű felhasználó: $username")
        }
    }
}