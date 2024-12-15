package trombitasp.ReservationManager.security.jwt

import jakarta.servlet.FilterChain
import jakarta.servlet.ServletException
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.util.StringUtils
import org.springframework.web.filter.OncePerRequestFilter
import trombitasp.ReservationManager.security.services.UserDetailsServiceImpl
import java.io.IOException


class AuthTokenFilter(
//    private val userDetailsService: UserDetailsServiceImpl,
//    private  val jwtUtils: JwtUtils
) : OncePerRequestFilter() {
    @Autowired
    private val jwtUtils: JwtUtils? = null

    @Autowired
    private val userDetailsService: UserDetailsServiceImpl? = null

    @Throws(ServletException::class, IOException::class)
    protected override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        try {
            val jwt = parseJwt(request)
            if (jwt != null && jwtUtils!!.validateJwtToken(jwt)) {
                val username: String = jwtUtils.getUserNameFromJwtToken(jwt)
                val userDetails = userDetailsService!!.loadUserByUsername(username)
                val authentication = UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.authorities
                )
                authentication.details = WebAuthenticationDetailsSource().buildDetails(request)
                SecurityContextHolder.getContext().authentication = authentication
            }
        } catch (e: Exception) {
            Companion.logger.error("Cannot set user authentication: {}", e)
        }

        filterChain.doFilter(request, response)
    }

    private fun parseJwt(request: HttpServletRequest): String? {
        val headerAuth = request.getHeader("Authorization")
        return if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            headerAuth.substring(7, headerAuth.length)
        } else null
    }

    private val publicKey: PublicKey

    init {
        val keyContent = configuration.auth.rsaPublicKey
            .replace("-----BEGIN PUBLIC KEY-----", "")
            .replace("-----END PUBLIC KEY-----", "")
            .replace("\n", "")

        publicKey = KeyFactory.getInstance("RSA")
            .generatePublic(X509EncodedKeySpec(Base64.getDecoder().decode(keyContent)))
    }

    fun getVerifiedClaims(token: String?): Claims? {
        if (token == null) {
            return null
        }

        val parser = Jwts.parserBuilder().setSigningKey(publicKey).build()
        return try {
            parser.parseClaimsJws(token).body
        } catch (ex: JwtException) {
            null
        }
    }

    fun validateClaims(claims: Claims): Boolean {
        val now = Date.from(Instant.now())
        return claims.notBefore.before(now) && claims.expiration.after(now)
                && claims.issuer in configuration.auth.allowedIssuers
    }

    fun isTokenValid(token: String?): Boolean {
        val claims = getVerifiedClaims(token) ?: return false
        return validateClaims(claims)
    }

    companion object {
        private val logger: Logger = LoggerFactory.getLogger(AuthTokenFilter::class.java)
    }
}