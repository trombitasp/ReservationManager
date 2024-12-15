package hu.trombitasp.coordinatorauthbackend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration
import org.springframework.boot.runApplication

@SpringBootApplication(exclude = [SecurityAutoConfiguration::class])
class CoordinatorAuthBackendApplication

fun main(args: Array<String>) {
	runApplication<CoordinatorAuthBackendApplication>(*args)
}
