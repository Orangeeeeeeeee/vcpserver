<template>
  <div style="display: flex; min-height: 100vh;">
    <aside style="width: 250px; background: #f5f5f5; padding: 1rem;">
      <nav>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li><NuxtLink to="/">Головна</NuxtLink></li>
          <li><NuxtLink to="/dashboard">Dashboard</NuxtLink></li>
          <li><NuxtLink to="/settings">Settings</NuxtLink></li>
          <li><NuxtLink to="/objects">Objects</NuxtLink></li>
        </ul>
      </nav>
    </aside>
    <main style="flex: 1; padding: 1rem;">
      <slot />
    </main>
  </div>
</template>
