package trombitasp.ReservationManager.controller

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import trombitasp.ReservationManager.model.Resource
import trombitasp.ReservationManager.repository.ResourceRepository

@RestController
@RequestMapping("/api")
class ResourceController(private val resourceRepository: ResourceRepository) {
    @GetMapping("/resources")
    fun findAllResource() = resourceRepository.findAll()

    @GetMapping("/resources/{id}")
    fun findResourceById(@PathVariable id: Int): ResponseEntity<Resource> {
        return resourceRepository.findById(id).map { r ->
            ResponseEntity.ok(r)
        }.orElse(ResponseEntity.notFound().build())
    }

    @GetMapping("/resources/byname/{name}")
    fun findAllResourceByName(@PathVariable name: String) = resourceRepository.findAllByName(name)

    @GetMapping("/resources/bydescription/{description}")
    fun findAllResourceByDescription(@PathVariable description: String) = resourceRepository.findAllByDescriptionContaining(description)

    @PostMapping("/resources")
    fun saveResource(@RequestBody resource: Resource) = resourceRepository.save(resource)

    @PutMapping("/resources/{id}")
    fun updateResource(@PathVariable id: Int, @RequestBody resource: Resource): ResponseEntity<Resource> {
        return resourceRepository.findById(id).map { existingResource ->
            val updatedResource: Resource = existingResource.copy(
                name = resource.name,
                description = resource.description,
                resourceProvider = resource.resourceProvider,
                reservation = resource.reservation)
            ResponseEntity.ok().body(resourceRepository.save(updatedResource))
        }.orElse(ResponseEntity.notFound().build())
    }

    @DeleteMapping("/resources/{id}")
    fun deleteResourceById(@PathVariable id: Int): ResponseEntity<Void> {
        return resourceRepository.findById(id).map { r  ->
            resourceRepository.delete(r)
            ResponseEntity<Void>(HttpStatus.OK)
        }.orElse(ResponseEntity.notFound().build())
    }
}