<script setup lang="ts">
// Карточка профиля с фото: лёгкий 3D-наклон за курсором и голографический отсвет.
// По мотивам ProfileCard из Vue Bits (David Haz), упрощённая своя реализация.
import { contacts, profile } from '~/data/profile'

const MAX_TILT = 7 // градусов

const card = ref<HTMLElement>()
let raf = 0

function onPointerMove(event: PointerEvent) {
  if (event.pointerType !== 'mouse')
    return
  const el = card.value!
  const rect = el.getBoundingClientRect()
  const px = (event.clientX - rect.left) / rect.width
  const py = (event.clientY - rect.top) / rect.height
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(() => {
    el.style.setProperty('--rx', `${(0.5 - py) * MAX_TILT * 2}deg`)
    el.style.setProperty('--ry', `${(px - 0.5) * MAX_TILT * 2}deg`)
    el.style.setProperty('--px', `${px * 100}%`)
    el.style.setProperty('--py', `${py * 100}%`)
    el.classList.add('profile--active')
  })
}

function onPointerLeave() {
  cancelAnimationFrame(raf)
  const el = card.value!
  el.style.setProperty('--rx', '0deg')
  el.style.setProperty('--ry', '0deg')
  el.classList.remove('profile--active')
}

onBeforeUnmount(() => cancelAnimationFrame(raf))
</script>

<template>
  <div class="profile-wrap">
    <figure ref="card" class="profile" @pointermove="onPointerMove" @pointerleave="onPointerLeave">
      <div class="profile__photo">
        <img src="/photo.jpg" :alt="`${profile.firstName} ${profile.lastName}`" width="640" height="640" loading="lazy">
      </div>
      <figcaption class="profile__body">
        <span class="profile__name">{{ profile.firstName }} {{ profile.lastName }}</span>
        <span class="profile__role mono">{{ profile.role }} · {{ profile.grade }}</span>
        <a :href="contacts.telegram" target="_blank" rel="noopener" class="profile__cta">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M21.6 3.6 2.9 10.8c-1.3.5-1.3 1.2-.2 1.6l4.8 1.5 1.8 5.6c.2.6.4.8.8.8.4 0 .6-.2.9-.5l2.4-2.3 4.9 3.6c.9.5 1.6.2 1.8-.8l3.2-15.2c.3-1.3-.5-1.9-1.4-1.5ZM9.4 14.4l-.4 4.1-1.5-4.8 11-6.9c.5-.3.9-.1.5.2l-9.6 7.4Z" />
          </svg>
          {{ contacts.telegramHandle }}
        </a>
      </figcaption>
      <span class="profile__sheen" aria-hidden="true" />
    </figure>
  </div>
</template>

<style lang="scss" scoped>
.profile-wrap {
  perspective: 900px;
}

.profile {
  --rx: 0deg;
  --ry: 0deg;
  --px: 50%;
  --py: 50%;

  position: relative;
  margin: 0;
  padding: 10px;
  border-radius: 20px;
  background: var(--h-raised);
  transform: rotateX(var(--rx)) rotateY(var(--ry));
  transform-style: preserve-3d;
  transition: transform 0.5s cubic-bezier(0.2, 0.7, 0.2, 1);
  will-change: transform;

  // Тонкая переливающаяся кромка.
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    padding: 1px;
    border-radius: inherit;
    background: conic-gradient(from 180deg at var(--px) var(--py), var(--h-line-strong), color-mix(in srgb, var(--h-accent) 55%, transparent), #3ecf8e55, var(--h-line-strong));
    mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    mask-composite: exclude;
    pointer-events: none;
  }

  &--active {
    transition: transform 0.12s linear;
  }

  &__photo {
    overflow: hidden;
    border-radius: 12px;
    aspect-ratio: 1;
    background: var(--h-surface);

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 16px 8px 8px;
  }

  &__name {
    font-size: 19px;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  &__role {
    color: var(--h-muted);
    font-size: 12px;
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    align-self: flex-start;
    gap: 7px;
    margin-top: 12px;
    color: var(--h-text);
    font-size: 14px;
    text-decoration: none;
    transition: color 0.2s;

    svg {
      width: 16px;
      height: 16px;
      fill: #2aabee;
    }

    &:hover {
      color: var(--h-accent);
    }
  }

  // Голографический отсвет следует за курсором.
  &__sheen {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(420px circle at var(--px) var(--py), rgba(255, 255, 255, 0.14), transparent 45%);
    mix-blend-mode: soft-light;
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
  }

  &--active &__sheen {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .profile {
    transform: none !important;
  }
}
</style>
