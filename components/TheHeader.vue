<template>
  <header class="header">
    <nav class="navigation">
      <ul class="PrimaryNav with-indicator">
        <li class="Nav-item" :class="{'is-active': $route.path === '/'}">
          <nuxt-link to="/">
            Home
          </nuxt-link>
        </li>
        <li class="Nav-item" :class="{'is-active': $route.path === '/uses'}">
          <nuxt-link to="/uses">
            Uses
          </nuxt-link>
        </li>
        <li class="Nav-item" :class="{'is-active': $route.path === '/blog'}">
          <nuxt-link to="/blog">
            Blog
          </nuxt-link>
        </li>
      </ul>
    </nav>
  </header>
</template>
<script lang="ts">
</script>

<style lang="scss" scoped>
$menu-items: 3;

$background-color: #121212;
$indicator-color: #e82d00;

$transition-speed: 1.3s;

$width: calc((100/$menu-items)) * 1%;
$menu-items-loop-offset: $menu-items - 1;

.PrimaryNav {
  @extend %cf;
  list-style: none;
  margin: 24px auto;
  max-width: 720px;
  padding: 0;
  width: 100%;
}

.Nav-item {
  background: #fff;
  display: block;
  float: left;
  margin: 0;
  padding: 0;
  width: $width;
  text-align: center;

  &:first-child {
    border-radius: 3px 0 0 3px;
  }

  &:last-child {
    border-radius: 0 3px 3px 0;
  }

  &.is-active a {
    color: $indicator-color;
  }

  a {
    color: $background-color;
    display: block;
    padding-top: 20px;
    padding-bottom: 20px;
    text-decoration: none;

    &:hover {
      color: $indicator-color;
    }
  }
}

.with-indicator {
  position: relative;
  z-index: 0;

  .Nav-item {
    &:last-child {
      &:before, &:after {
        content: '';
        display: block;
        position: absolute;
        pointer-events: none;
        transition: left #{$transition-speed} ease;
      }
      &:before {
        border: 6px solid transparent;
        border-top-color: $indicator-color;
        width: 0;
        height: 0;
        top: 0;
        left: calc($width/2);
        margin-left: -3px;
      }
      &:after {
        background: $indicator-color;
        top: -6px;
        bottom: -6px;
        left: 0;
        width: $width;
        z-index: -1;
      }

    }

  }

  @for $i from 1 through $menu-items-loop-offset {
    .Nav-item:nth-child(#{$i}).is-active ~ .Nav-item:last-child:after {
      left: calc(($width*$i) - $width);
    }
    .Nav-item:nth-child(#{$i}).is-active ~ .Nav-item:last-child:before
    {
      left: calc(($width*$i) + ($width/2) - $width);
    }
  }

  @for $i from 1 through $menu-items-loop-offset {
    .Nav-item:nth-child(#{$i}):hover ~ .Nav-item:last-child:after {
      left: calc(($width*$i) - $width) !important;
    }

    .Nav-item:nth-child(#{$i}):hover ~ .Nav-item:last-child:before{
      left: calc(($width*$i) + ($width/2) - $width) !important;
    }

  }

  .Nav-item {
    &:last-child {
      &:hover, &.is-active {
        &:before {
          left: calc((100% - $width) + ($width/2)) !important;
        }
        &:after{
          left: 100%-$width !important;
        }
      }
    }
  }

}

*, *:before, *:after {
  box-sizing: border-box;
}

%cf:before,
%cf:after {
  content: " ";
  display: table;
}
%cf:after {
  clear: both;
}

.toggle {
  color: #fff;
  font-family: sans-serif;
  text-align: center;
}

</style>
