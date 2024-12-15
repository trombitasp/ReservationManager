package trombitasp.ReservationManager.controller

import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import trombitasp.ReservationManager.model.ResourceProvider
import trombitasp.ReservationManager.repository.ResourceProviderRepository
import java.util.*


@RestController
@RequestMapping("/api")
@CrossOrigin
class ResourceProviderController(private val resourceProviderRepository: ResourceProviderRepository) {
    @GetMapping("/resourceproviders")
    fun findAllResourceProvider() = resourceProviderRepository.findAll()

    @GetMapping("/resourceproviders/{id}")
    fun findResourceProviderById(@PathVariable id: Int): ResponseEntity<ResourceProvider> {
        return resourceProviderRepository.findById(id).map { r ->
            ResponseEntity.ok(r)
        }.orElse(ResponseEntity.notFound().build())
    }

    @GetMapping("/resourceproviders/{name}/{description}/")
    fun findAllResourceProviderByName(@PathVariable name: String, @PathVariable description: String) =
        resourceProviderRepository.findAll(name, description)

    @GetMapping("/resourceproviders/{id}/image")
    fun getProductImage(@PathVariable id: Int): ResponseEntity<ByteArray> {
        val providerOpt = resourceProviderRepository.findById(id)
        return if (providerOpt.isPresent) {
            val provider = providerOpt.get()
            val imageBytes: ByteArray = Base64.getDecoder().decode(provider.image)
            val headers = HttpHeaders()
            headers.contentType = MediaType.IMAGE_JPEG
            ResponseEntity<ByteArray>(imageBytes, headers, HttpStatus.OK)
        } else {
            ResponseEntity(ByteArray(0), HttpStatus.NOT_FOUND)
        }
    }

    @PostMapping("/resourceproviders")
    @PreAuthorize("hasAuthority('ADMIN')")
    fun saveResourceProvider(@RequestBody resourceProvider: ResourceProvider) = resourceProviderRepository.save(resourceProvider)

    @PutMapping("/resourceproviders/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    fun updateResourceProvider(@PathVariable id: Int, @RequestBody resourceProvider: ResourceProvider, @RequestParam("imageFile") imageFile: MultipartFile): ResponseEntity<ResourceProvider> {
        return resourceProviderRepository.findById(id).map { existingResourceProvider ->
            val updatedResourceProvider: ResourceProvider = existingResourceProvider.copy(
                name = resourceProvider.name,
                description = resourceProvider.description,
                minReservationTime = resourceProvider.minReservationTime,
                maxReservationTime = resourceProvider.maxReservationTime,
                image = Base64.getEncoder().encodeToString(imageFile.bytes),
            )
            ResponseEntity.ok().body(resourceProviderRepository.save(updatedResourceProvider))
        }.orElse(ResponseEntity.notFound().build())
    }

    @DeleteMapping("/resourceproviders/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    fun deleteResourceProviderById(@PathVariable id: Int): ResponseEntity<Void> {
        return resourceProviderRepository.findById(id).map { r ->
            resourceProviderRepository.delete(r)
            ResponseEntity<Void>(HttpStatus.OK)
        }.orElse(ResponseEntity.notFound().build())
    }
}