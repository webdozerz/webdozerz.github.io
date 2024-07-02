<template>
  <div class="bio">
    <h2>Андрюшов Илья</h2>
    <a class="bio__link" href="mailto:webdozerz@gmail.com">webdozerz@gmail.com</a>
    <p>
      Frontend-разработчик, специализируюсь на создании удобных и интуитивно понятных веб-приложений, интерфейсов, а также проектов на основе блокчейн-технологий и других инноваций.
    </p>
  </div>
</template>

<style lang="scss" scoped>
.bio {
  display: flex;
  flex-direction: column;
  gap: 12px;
  &__link {
    width: fit-content;
    color: var(--green);
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
