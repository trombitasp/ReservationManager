package trombitasp.ReservationManager.controller

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import trombitasp.ReservationManager.model.ResourceProvider
import trombitasp.ReservationManager.repository.ResourceProviderRepository

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

    /*@GetMapping("/resourceproviders/bydescription/{description}")
    fun findAllResourceProviderByDescription(@PathVariable description: String) =
        resourceProviderRepository.findAllByDescriptionContaining(description)*/

    @PostMapping("/resourceproviders")
    @PreAuthorize("hasAuthority('ADMIN')")
    fun saveResourceProvider(@RequestBody resourceProvider: ResourceProvider) = resourceProviderRepository.save(resourceProvider)

    @PutMapping("/resourceproviders/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    fun updateResourceProvider(@PathVariable id: Int, @RequestBody resourceProvider: ResourceProvider): ResponseEntity<ResourceProvider> {
        return resourceProviderRepository.findById(id).map { existingResourceProvider ->
            val updatedResourceProvider: ResourceProvider = existingResourceProvider.copy(
                name = resourceProvider.name,
                description = resourceProvider.description,
                minReservationTime = resourceProvider.minReservationTime,
                maxReservationTime = resourceProvider.maxReservationTime,
                /*resources = resourceProvider.resources*/)
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