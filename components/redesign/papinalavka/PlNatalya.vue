<script lang="ts" setup>
// Наталья Папина с главной оригинала: круглый портрет в рамке и её слова облачком под ним.
</script>

<template>
  <figure class="pl-nat">
    <img :src="plNatalya.photo" alt="Наталья Папина" width="160" height="158" class="pl-nat__photo" />
    <blockquote class="pl-nat__bubble">
      <p>{{ plNatalya.quote }}</p>
      <figcaption>Наталья Папина</figcaption>
    </blockquote>
  </figure>
</template>

<style lang="scss" scoped>
.pl-nat {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 420px;
  margin: 0 auto;

  &__photo {
    width: 150px;
    height: 150px;
    border: 6px solid #8a5a35;
    border-radius: 50%;
    object-fit: cover;
    background: var(--pl-kraft-2);
  }

  &__bubble {
    position: relative;
    margin: 18px 0 0;
    padding: 20px 22px 16px;
    border-radius: 16px;
    background: #fffaf1;
    box-shadow: 0 6px 18px rgba(56, 41, 38, 0.12);

    // хвостик облачка к портрету
    &::before {
      content: '';
      position: absolute;
      top: -14px;
      left: 38%;
      border: 14px solid transparent;
      border-top: 0;
      border-bottom-color: #fffaf1;
    }

    p {
      color: var(--pl-dark);
      font-size: 17px;
      font-style: italic;
      line-height: 1.5;
    }
  }

  figcaption {
    margin-top: 8px;
    color: var(--pl-wood);
    font-family: var(--pl-hand);
    font-size: 30px;
    font-weight: 700;
    line-height: 1.2;
    text-align: right;
  }

  @media (max-width: 576px) {
    &__photo {
      width: 128px;
      height: 128px;
    }

    &__bubble p {
      font-size: 16px;
    }
  }
}
</style>
