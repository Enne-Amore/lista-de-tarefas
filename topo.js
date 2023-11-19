// Chamando a tag que representa o botão de ir pro topo
const topo = document.getElementById('topo')

// Adicionando os eventos
topo.addEventListener("click", function(){
    window.scrollTo(0, 0)
})

// Voltar ao topo usando o teclado
topo.addEventListener('keypress', (tecla) => {
    if (tecla.key === "Enter") {
        tecla.target.click()
    }
})