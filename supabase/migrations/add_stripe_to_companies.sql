-- Adiciona colunas de assinatura Stripe na tabela companies
ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS subscription_status TEXT NOT NULL DEFAULT 'trialing',
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Index para busca rápida por customer e subscription
CREATE INDEX IF NOT EXISTS idx_companies_stripe_customer ON companies(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_companies_stripe_subscription ON companies(stripe_subscription_id);

-- Empresas existentes ficam como trialing por 30 dias
-- (ajuste conforme necessário)
