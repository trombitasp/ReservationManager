package trombitasp.ReservationManager

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.dao.DaoAuthenticationProvider
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import trombitasp.ReservationManager.security.jwt.AuthEntryPointJwt
import trombitasp.ReservationManager.security.jwt.AuthTokenFilter
import trombitasp.ReservationManager.security.services.UserDetailsServiceImpl


@Configuration
@EnableMethodSecurity(prePostEnabled = true)
@EnableWebSecurity      // TODO ez kell-e
class WebSecurityConfig {
    @Autowired
    var userDetailsService: UserDetailsServiceImpl? = null

    @Autowired
    private val unauthorizedHandler: AuthEntryPointJwt? = null
    @Bean
    fun authenticationJwtTokenFilter(): AuthTokenFilter {
        return AuthTokenFilter()
    }

    @Bean
    fun authenticationProvider(): DaoAuthenticationProvider {
        val authProvider = DaoAuthenticationProvider()
        authProvider.setUserDetailsService(userDetailsService)
        authProvider.setPasswordEncoder(passwordEncoder())
        return authProvider
    }

    @Bean
    @Throws(Exception::class)
    fun authenticationManager(authConfig: AuthenticationConfiguration): AuthenticationManager {
        return authConfig.authenticationManager
    }

    @Bean
    fun passwordEncoder(): PasswordEncoder {
        return BCryptPasswordEncoder()
    }

    @Bean
    @Throws(Exception::class)
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http.cors().and().csrf().disable()
            .exceptionHandling().authenticationEntryPoint(unauthorizedHandler).and()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
            .authorizeHttpRequests().requestMatchers("/api/auth/**").permitAll()
            .requestMatchers("/api/test/**").permitAll()
            .anyRequest().authenticated()
        http.authenticationProvider(authenticationProvider())
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter::class.java)
        return http.build()
    }
}




//@Configuration
//@EnableWebMvc
//class WebConfig : WebMvcConfigurer {
//    override fun addCorsMappings(registry: CorsRegistry) {
//        registry.addMapping("/**")
//    }
//
//}