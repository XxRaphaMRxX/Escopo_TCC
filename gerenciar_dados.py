import json
import os
import time

# Nome do arquivo da nossa base de dados
NOME_ARQUIVO = 'dados.json'

def limpar_tela():
    """Limpa a tela do terminal para melhor visualização."""
    os.system('cls' if os.name == 'nt' else 'clear')

def carregar_dados():
    """Carrega os dados do arquivo JSON. Se o arquivo não existir, retorna uma lista vazia."""
    try:
        with open(NOME_ARQUIVO, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []

def salvar_dados(dados):
    """Salva os dados no arquivo JSON com uma formatação legível."""
    with open(NOME_ARQUIVO, 'w', encoding='utf-8') as f:
        json.dump(dados, f, indent=4, ensure_ascii=False)

def obter_media_de_leituras(nome_parametro, num_leituras=3):
    """Pede 'num_leituras' ao usuário para um parâmetro e retorna a média."""
    leituras = []
    print(f"\n--- Insira as {num_leituras} leituras para {nome_parametro} ---")
    for i in range(num_leituras):
        while True:
            try:
                leitura_str = input(f"  Leitura {i + 1}: ").replace(',', '.')
                leitura = float(leitura_str)
                leituras.append(leitura)
                break
            except ValueError:
                print("    Erro: Por favor, insira um número válido.")
    
    media = sum(leituras) / len(leituras)
    print(f"-> Média calculada para {nome_parametro}: {media:.2f}°C")
    time.sleep(1) # Pequena pausa para o usuário ver a média calculada
    return round(media, 2)

def listar_testes(dados):
    """Exibe uma lista numerada de todos os testes."""
    limpar_tela()
    print("--- Testes Salvos ---")
    if not dados:
        print("Nenhum teste encontrado.")
    else:
        for i, teste in enumerate(dados):
            print(f"{i + 1}. {teste['nome']} (Ambiente: {teste['tempAmbiente']:.1f}°C, Arborizado: {teste['tempArborizado']:.1f}°C, Exposto: {teste['tempExposto']:.1f}°C)")
    print("-" * 20)
    input("\nPressione Enter para voltar ao menu...")

def adicionar_teste(dados):
    """Adiciona um novo teste à base de dados, calculando as médias das leituras."""
    limpar_tela()
    print("--- Adicionar Novo Teste ---")
    try:
        nome = input("Nome do teste (ex: Dia 6 ou 22/06): ")
        if not nome:
            print("\nO nome do teste não pode ser vazio.")
            time.sleep(2)
            return

        # Obter médias das 3 leituras para cada parâmetro
        media_ambiente = obter_media_de_leituras("Temperatura Ambiente")
        media_arborizado = obter_media_de_leituras("Temperatura da Superfície Arborizada")
        media_exposto = obter_media_de_leituras("Temperatura da Superfície Exposta")
        
        novo_teste = {
            "nome": nome,
            "tempAmbiente": media_ambiente,
            "tempArborizado": media_arborizado,
            "tempExposto": media_exposto
        }

        limpar_tela()
        print("--- Revisão dos Dados (Médias Finais) ---")
        print(f"Nome: {novo_teste['nome']}")
        print(f"Média Temp. Ambiente: {novo_teste['tempAmbiente']:.2f}°C")
        print(f"Média Temp. Arborizado: {novo_teste['tempArborizado']:.2f}°C")
        print(f"Média Temp. Exposto: {novo_teste['tempExposto']:.2f}°C")
        
        confirmar = input("\nDeseja salvar estes dados? (S/N): ").strip().lower()
        if confirmar == 's':
            dados.append(novo_teste)
            salvar_dados(dados)
            print("\nTeste adicionado com sucesso!")
        else:
            print("\nOperação cancelada.")
    
    except ValueError:
        print("\nErro: Entrada inválida durante a inserção.")
    
    input("\nPressione Enter para voltar ao menu...")

def editar_teste(dados):
    """Edita um teste existente, com opção de reinserir as 3 leituras."""
    listar_testes(dados)
    if not dados:
        return

    try:
        escolha_str = input("Digite o número do teste que deseja editar (ou 0 para cancelar): ")
        if not escolha_str.isdigit():
            print("Entrada inválida.")
            time.sleep(2)
            return
            
        escolha = int(escolha_str)
        if 0 < escolha <= len(dados):
            teste_original = dados[escolha - 1].copy()
            teste_editado = dados[escolha - 1]
            
            limpar_tela()
            print(f"--- Editando Teste: {teste_original['nome']} ---")
            
            # Editar nome
            novo_nome = input(f"Nome ({teste_original['nome']}): ")
            if novo_nome: teste_editado['nome'] = novo_nome

            # Editar Temperatura Ambiente
            if input(f"Deseja editar a 'Temperatura Ambiente' (média atual: {teste_original['tempAmbiente']:.2f}°C)? (S/N): ").lower() == 's':
                teste_editado['tempAmbiente'] = obter_media_de_leituras("Temperatura Ambiente")
            
            # Editar Temperatura Arborizada
            if input(f"Deseja editar a 'Temperatura Arborizada' (média atual: {teste_original['tempArborizado']:.2f}°C)? (S/N): ").lower() == 's':
                teste_editado['tempArborizado'] = obter_media_de_leituras("Temperatura da Superfície Arborizada")
            
            # Editar Temperatura Exposta
            if input(f"Deseja editar a 'Temperatura Exposta' (média atual: {teste_original['tempExposto']:.2f}°C)? (S/N): ").lower() == 's':
                teste_editado['tempExposto'] = obter_media_de_leituras("Temperatura da Superfície Exposta")

            salvar_dados(dados)
            print("\nTeste editado com sucesso!")

        elif escolha != 0:
            print("Escolha inválida.")
    
    except ValueError:
        print("\nErro: Entrada inválida.")

    input("\nPressione Enter para voltar ao menu...")


def excluir_teste(dados):
    # (Esta função não precisa de alterações)
    listar_testes(dados)
    if not dados:
        return
    try:
        escolha = int(input("Digite o número do teste que deseja EXCLUIR (ou 0 para cancelar): "))
        if 0 < escolha <= len(dados):
            teste_removido = dados.pop(escolha - 1)
            salvar_dados(dados)
            print(f"\nTeste '{teste_removido['nome']}' removido com sucesso!")
        elif escolha != 0:
            print("Escolha inválida.")
    except ValueError:
        print("\nErro: Entrada inválida.")
    input("\nPressione Enter para voltar ao menu...")


def menu_principal():
    # (Esta função não precisa de alterações)
    while True:
        dados = carregar_dados()
        limpar_tela()
        print("========== Gerenciador de Dados REFRIGERIUM ==========")
        print("1. Listar todos os testes")
        print("2. Adicionar novo teste")
        print("3. Editar um teste existente")
        print("4. Excluir um teste")
        print("5. Sair")
        print("======================================================")
        escolha = input("Escolha uma opção: ")
        if escolha == '1': listar_testes(dados)
        elif escolha == '2': adicionar_teste(dados)
        elif escolha == '3': editar_teste(dados)
        elif escolha == '4': excluir_teste(dados)
        elif escolha == '5': print("Saindo..."); break
        else: print("Opção inválida."); time.sleep(1)

if __name__ == "__main__":
    menu_principal()