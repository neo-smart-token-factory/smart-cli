# 🔧 Instalação do Foundry

Este projeto usa **Foundry** (forge) para compilar e testar contratos. Você precisa instalá-lo antes de usar os scripts.

## 🚀 Instalação Rápida (macOS/Linux)

### Método 1: Instalação Automática (Recomendado)

```bash
# Instalar Foundry
curl -L https://foundry.paradigm.xyz | bash

# Recarregar o shell
source ~/.bashrc  # ou ~/.zshrc se usar zsh

# Instalar ferramentas do Foundry
foundryup
```

### Método 2: Via Homebrew (macOS)

```bash
brew install foundry
```

### Método 3: Build Manual

Se os métodos acima não funcionarem, veja: https://book.getfoundry.sh/getting-started/installation

## ✅ Verificar Instalação

Após instalar, verifique se está funcionando:

```bash
forge --version
cast --version
anvil --version
```

Você deve ver algo como:
```
forge 0.2.0 (abc123 2024-01-01T00:00:00.000000000Z)
```

## 🔧 Configurar PATH (se necessário)

Se o comando `forge` não for encontrado após instalação:

### Para zsh (macOS padrão):

```bash
# Adicionar ao ~/.zshrc
echo 'export PATH="$HOME/.foundry/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Para bash:

```bash
# Adicionar ao ~/.bashrc ou ~/.bash_profile
echo 'export PATH="$HOME/.foundry/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

## 📦 Instalar Dependências do Projeto

Após instalar o Foundry:

```bash
# 1. Instalar dependências npm/yarn
yarn install

# 2. Instalar dependências do Foundry
cd /Users/nettomello/CODIGOS/contracts
forge install
```

## 🧪 Testar Instalação

```bash
# Compilar contratos
forge build

# Executar testes
forge test
```

## ❓ Troubleshooting

### Erro: "forge: command not found"

**Solução 1**: Recarregue o shell
```bash
source ~/.zshrc  # ou ~/.bashrc
```

**Solução 2**: Adicione ao PATH manualmente
```bash
export PATH="$HOME/.foundry/bin:$PATH"
```

**Solução 3**: Verifique se Foundry está instalado
```bash
ls -la ~/.foundry/bin/
```

Se não existir, reinstale o Foundry.

### Erro: "Permission denied"

```bash
chmod +x ~/.foundry/bin/forge
```

### Erro ao executar `forge install`

Certifique-se de estar no diretório do projeto:
```bash
cd /Users/nettomello/CODIGOS/contracts
forge install
```

## 📚 Recursos

- **Foundry Book**: https://book.getfoundry.sh/
- **GitHub**: https://github.com/foundry-rs/foundry
- **Documentação**: https://book.getfoundry.sh/

---

**Após instalar o Foundry, você poderá usar todos os scripts de verificação!**

