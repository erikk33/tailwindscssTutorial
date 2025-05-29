// Mobile menu toggle
        const mobileMenuButton = document.getElementById('mobileMenuButton');
        const sidebar = document.getElementById('sidebar');
        mobileMenuButton.addEventListener('click', () => {
            sidebar.classList.toggle('-translate-x-full');
        });

        // Smooth scroll for navigation links & close mobile menu on nav click
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    // Smooth scroll
                    /*
                    // Native smooth scroll (uncomment if preferred and supported)
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start' 
                    });
                    */

                    // Manual smooth scroll for wider compatibility & offset
                    const headerOffset = 72; // approx height of fixed header/navbar if any on desktop
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                         top: offsetPosition,
                         behavior: "smooth"
                    });
                }
                // Close mobile sidebar if open
                if (!sidebar.classList.contains('-translate-x-full') && window.innerWidth < 768) {
                    sidebar.classList.add('-translate-x-full');
                }
            });
        });

        // Active navigation link highlighting on scroll
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        function changeLinkState() {
            let index = sections.length;

            while(--index && window.scrollY + 100 < sections[index].offsetTop) {} // 100 as offset
            
            navLinks.forEach((link) => link.classList.remove('active'));
            // Check if the corresponding navLink exists before trying to add 'active'
            if (navLinks[index]) {
                 // Find the correct nav link, including those inside details/summary
                const targetNavLink = document.querySelector(`.nav-link[href="#${sections[index].id}"]`) || 
                                      document.querySelector(`ul ul .nav-link[href="#${sections[index].id}"]`);
                if(targetNavLink) {
                    targetNavLink.classList.add('active');
                    
                    // Open parent details if child link is active
                    const parentDetails = targetNavLink.closest('details');
                    if (parentDetails && !parentDetails.hasAttribute('open')) {
                        parentDetails.setAttribute('open', '');
                    }
                }
            }
        }
        // Initial call
        changeLinkState();
        window.addEventListener('scroll', changeLinkState);

        // Copy code block functionality (simulated)
        document.querySelectorAll('pre').forEach(preElement => {
            const codeContent = preElement.querySelector('code').innerText;
            const copyButton = document.createElement('button');
            copyButton.innerText = 'Salin';
            copyButton.classList.add('copy-btn');
            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(codeContent).then(() => {
                    copyButton.innerText = 'Disalin!';
                    setTimeout(() => {
                        copyButton.innerText = 'Salin';
                    }, 2000);
                }).catch(err => {
                    console.error('Gagal menyalin kode: ', err);
                    alert('Gagal menyalin kode. Coba salin manual.');
                });
            });
            preElement.appendChild(copyButton);
        });

        // Simple conceptual progress chart
        const progressChartCtx = document.getElementById('progressChart')?.getContext('2d');
        if (progressChartCtx) {
            // Dummy data - in a real app, this would come from user progress
            const sectionsTotal = sections.length -1; // exclude hero
            const sectionsCompleted = Math.floor(sectionsTotal / 3); // example: 1/3rd completed

            new Chart(progressChartCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Selesai', 'Belum Selesai'],
                    datasets: [{
                        label: 'Progres Tutorial',
                        data: [sectionsCompleted, sectionsTotal - sectionsCompleted],
                        backgroundColor: [
                            '#A3B18A', // Subtle green for completed
                            '#E9E5E0'  // Lighter beige for remaining
                        ],
                        borderColor: [
                            '#FDFBF6',
                            '#FDFBF6'
                        ],
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed !== null) {
                                        label += context.parsed + ' bagian';
                                    }
                                    return label;
                                }
                            }
                        }
                    }
                }
            });
        }

        // Automatically open details if a sub-link is targeted by URL hash
        function openDetailsForHash() {
            const hash = window.location.hash;
            if (hash) {
                const targetLink = document.querySelector(`.nav-link[href="${hash}"]`);
                if (targetLink) {
                    const parentDetails = targetLink.closest('details');
                    if (parentDetails && !parentDetails.hasAttribute('open')) {
                        parentDetails.setAttribute('open', '');
                    }
                    // Ensure the target is visible after details is opened
                    setTimeout(() => {
                        const targetElement = document.querySelector(hash);
                        if(targetElement) {
                             const headerOffset = 72;
                             const elementPosition = targetElement.getBoundingClientRect().top;
                             const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                             window.scrollTo({ top: offsetPosition, behavior: "auto" });
                        }
                    }, 0); // Timeout to allow DOM update
                }
            }
        }
        window.addEventListener('load', openDetailsForHash);
        window.addEventListener('hashchange', openDetailsForHash);

