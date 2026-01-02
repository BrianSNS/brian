document.addEventListener('DOMContentLoaded', () => {
    /* --- 1. LÓGICA DE EXPANSÃO DAS COLUNAS --- */
    const colunas = document.querySelectorAll('.coluna');
    const container = document.querySelector('.site-container');

    colunas.forEach(coluna => {
        coluna.addEventListener('click', (e) => {
            
            // --- TRAVA DE SEGURANÇA (O QUE VOCÊ PEDIU) ---
            // Se a coluna já estiver aberta, verificamos onde foi o clique.
            // Se clicou em algo interativo (botão, seta, card), NÃO fazemos nada com a coluna.
            if (coluna.classList.contains('expandida')) {
                if (e.target.closest('.carousel-btn') ||    // Clicou na Seta?
                    e.target.closest('.carousel-nav') ||    // Clicou na Bolinha?
                    e.target.closest('.project-card') ||    // Clicou no Card/Texto?
                    e.target.closest('.btn-projeto')  ||    // Clicou no botão ver projeto?
                    e.target.closest('a')) {                // Clicou em algum link?
                    return; // PARE AQUI! Não feche a coluna.
                }
            }

            // --- Lógica Padrão de Abrir/Fechar ---
            const jaExpandida = coluna.classList.contains('expandida');

            // 1. Remove a classe 'expandida' de todas as colunas
            colunas.forEach(c => c.classList.remove('expandida'));
            container.classList.remove('tem-expandido');

            // 2. Se a coluna clicada NÃO estava expandida, a expande.
            if (!jaExpandida) {
                coluna.classList.add('expandida');
                container.classList.add('tem-expandido');
            }
        });
    });


    /* --- 2. LÓGICA DO CARROSSEL DE PROJETOS --- */
    const track = document.querySelector('.carousel-track');
    
    // Verifica se o carrossel existe antes de tentar rodar o código
    if (track) { 
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.btn-next');
        const prevButton = document.querySelector('.btn-prev');
        const dotsNav = document.querySelector('.carousel-nav');
        
        // Proteção extra caso não existam bolinhas ou slides
        if (slides.length > 0 && dotsNav) {
            const dots = Array.from(dotsNav.children);

            const moveToSlide = (track, currentSlide, targetSlide) => {
                // Move usando CSS Transform (porcentagem é mais seguro que pixels aqui)
                const targetIndex = slides.findIndex(slide => slide === targetSlide);
                track.style.transform = 'translateX(-' + (targetIndex * 100) + '%)';
                
                currentSlide.classList.remove('current-slide');
                targetSlide.classList.add('current-slide');
            };

            const updateDots = (currentDot, targetDot) => {
                if(currentDot) currentDot.classList.remove('current-slide');
                if(targetDot) targetDot.classList.add('current-slide');
            };

            // Botão PRÓXIMO
            if (nextButton) {
                nextButton.addEventListener('click', e => {
                    const currentSlide = track.querySelector('.current-slide');
                    const nextSlide = currentSlide.nextElementSibling;
                    const currentDot = dotsNav.querySelector('.current-slide');
                    const nextDot = currentDot.nextElementSibling;

                    if (nextSlide) {
                        moveToSlide(track, currentSlide, nextSlide);
                        updateDots(currentDot, nextDot);
                    }
                });
            }

            // Botão ANTERIOR
            if (prevButton) {
                prevButton.addEventListener('click', e => {
                    const currentSlide = track.querySelector('.current-slide');
                    const prevSlide = currentSlide.previousElementSibling;
                    const currentDot = dotsNav.querySelector('.current-slide');
                    const prevDot = currentDot.previousElementSibling;

                    if (prevSlide) {
                        moveToSlide(track, currentSlide, prevSlide);
                        updateDots(currentDot, prevDot);
                    }
                });
            }

            // Navegação por BOLINHAS
            dotsNav.addEventListener('click', e => {
                const targetDot = e.target.closest('button');

                if (!targetDot) return;

                const currentSlide = track.querySelector('.current-slide');
                const currentDot = dotsNav.querySelector('.current-slide');
                const targetIndex = dots.findIndex(dot => dot === targetDot);
                const targetSlide = slides[targetIndex];

                moveToSlide(track, currentSlide, targetSlide);
                updateDots(currentDot, targetDot);
            });
        }
    }
});