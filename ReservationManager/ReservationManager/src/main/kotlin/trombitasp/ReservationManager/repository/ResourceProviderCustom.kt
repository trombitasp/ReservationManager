package trombitasp.ReservationManager.repository

import trombitasp.ReservationManager.model.ResourceProvider

interface ResourceProviderCustom {
    fun findAll(name: String?, description: String?): List<ResourceProvider>
}
