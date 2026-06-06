#!/bin/bash
set -euo pipefail

# Grix Website - Cloudflare 资源初始化和部署脚本
# 使用方式: ./scripts/setup-cloudflare.sh [preview|production]

ENV="${1:-preview}"
echo "=== Grix Website 部署 ==="
echo "环境: $ENV"
echo ""

# 检查 Token
if [ -z "${CLOUDFLARE_API_TOKEN:-}" ]; then
  echo "错误: CLOUDFLARE_API_TOKEN 未设置"
  echo "请在 ~/.zshrc 中填入 Token 后执行 source ~/.zshrc"
  exit 1
fi

# 1. 创建 D1 数据库
echo "--- 步骤 1: 创建 D1 数据库 ---"
DB_NAME="grix-website-db-${ENV}"
DB_OUTPUT=$(npx wrangler d1 list --json 2>/dev/null || echo "[]")
DB_ID=$(echo "$DB_OUTPUT" | node -e "
  const chunks = [];
  process.stdin.on('data', c => chunks.push(c));
  process.stdin.on('end', () => {
    try {
      const data = JSON.parse(Buffer.concat(chunks).toString());
      const db = data.find(d => d.name === '${DB_NAME}');
      if (db) { console.log(db.uuid); } else { console.log(''); }
    } catch { console.log(''); }
  });
" 2>/dev/null)

if [ -z "$DB_ID" ]; then
  echo "创建 D1 数据库: $DB_NAME"
  CREATE_OUTPUT=$(npx wrangler d1 create "$DB_NAME" 2>&1)
  DB_ID=$(echo "$CREATE_OUTPUT" | grep -oE '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' | head -1)
  if [ -z "$DB_ID" ]; then
    echo "错误: 无法获取数据库 ID"
    echo "$CREATE_OUTPUT"
    exit 1
  fi
  echo "数据库已创建, ID: $DB_ID"
else
  echo "D1 数据库已存在: $DB_NAME (ID: $DB_ID)"
fi

# 2. 运行数据库迁移
echo ""
echo "--- 步骤 2: 运行数据库迁移 ---"
if [ -f "db/migrations/0001_init_website_cms.sql" ]; then
  echo "执行建表迁移..."
  npx wrangler d1 execute "$DB_NAME" --remote --file="db/migrations/0001_init_website_cms.sql" 2>&1
  echo "迁移完成"
else
  echo "跳过: 迁移文件不存在"
fi

# 3. 导入种子数据
echo ""
echo "--- 步骤 3: 导入种子数据 ---"
if [ -f "db/seeds/0001_seed_defaults.sql" ]; then
  echo "导入 Grix 默认数据..."
  npx wrangler d1 execute "$DB_NAME" --remote --file="db/seeds/0001_seed_defaults.sql" 2>&1
  echo "种子数据已导入"
else
  echo "跳过: 种子文件不存在"
fi

# 4. 创建 R2 存储桶
echo ""
echo "--- 步骤 4: 创建 R2 存储桶 ---"
R2_NAME="grix-website-media-${ENV}"
if npx wrangler r2 bucket list 2>/dev/null | grep -q "$R2_NAME"; then
  echo "R2 存储桶已存在: $R2_NAME"
else
  echo "创建 R2 存储桶: $R2_NAME"
  npx wrangler r2 bucket create "$R2_NAME" 2>&1 || true
fi

# 5. 更新 wrangler.toml 中的 database_id
echo ""
echo "--- 步骤 5: 更新配置 ---"
if [ "$ENV" = "production" ]; then
  sed -i.bak "s/^database_id = \"\"/database_id = \"$DB_ID\"/" wrangler.toml 2>/dev/null || \
  sed -i '' "s/^database_id = \"\"/database_id = \"$DB_ID\"/" wrangler.toml
  echo "已更新 wrangler.toml production D1 database_id"
else
  echo "preview 环境使用 wrangler pages deploy, 绑定在 Dashboard 配置"
fi

# 6. 构建并部署
echo ""
echo "--- 步骤 6: 构建并部署 ---"
echo "运行质量检查..."
npm run ci:guard

echo ""
echo "部署到 Cloudflare Pages (环境: $ENV)..."
npx wrangler pages deploy dist --project-name=grix-website --branch="$ENV" 2>&1

echo ""
echo "=== 部署完成 ==="
echo ""
echo "后续需要在 Cloudflare Dashboard 完成:"
echo "  1. Pages 项目 > Settings > Bindings > 绑定 D1 (DB) 和 R2 (BUCKET)"
echo "  2. 配置 Cloudflare Access 保护 /admin/* 和 /api/admin/*"
echo "  3. 绑定自定义域名 (如需要)"
