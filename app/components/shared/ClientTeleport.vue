<template>
    <ClientOnly>
        <Teleport :to="to">
            <slot></slot>
        </Teleport>
    </ClientOnly>
</template>

<script setup lang="ts">
/**
 * Client-only wrapper around `<Teleport>`.
 *
 * Nuxt renders teleports on the server only for the `#teleports` target, so
 * teleporting into layout containers (e.g. `#page-breadcrumbs-target`) during
 * SSR leaves them empty in the server HTML and causes hydration mismatches.
 * Wrapping in `<ClientOnly>` defers the teleport until after mount. This also
 * makes media-query-driven targets safe, since they resolve on the client.
 */
interface ClientTeleportProps {
    /** CSS selector of the teleport target (e.g. '#page-actions-target') */
    to: string;
}

defineProps<ClientTeleportProps>();
</script>
