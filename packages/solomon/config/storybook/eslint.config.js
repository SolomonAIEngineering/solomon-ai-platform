import { configs, defineConfig } from '@solomon/eslint';

export default defineConfig(
  ...configs.base,
  ...configs.react,
  ...configs.storybook,
);
