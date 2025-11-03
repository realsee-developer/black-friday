// 自定义插件：移除不支持的 @property 规则
const removeUnsupportedAtProperty = () => {
  return {
    postcssPlugin: 'remove-unsupported-at-property',
    Once(root) {
      root.walkAtRules('property', (rule) => {
        // 保留 @property 规则，但添加 @supports 包装以避免警告
        const supports = rule.root().append(`@supports (background: paint(something)) {}`);
        const supportsRule = root.last;
        if (supportsRule && supportsRule.type === 'atrule') {
          rule.remove();
          supportsRule.append(rule);
        }
      });
    }
  }
}
removeUnsupportedAtProperty.postcss = true;

const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
