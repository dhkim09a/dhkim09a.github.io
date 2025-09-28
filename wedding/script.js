document.addEventListener('DOMContentLoaded', () => {
    /* Firebase and Guestbook/Donation Logic */
    const { ref, onValue, push, serverTimestamp, runTransaction, increment, database } = window.firebaseDB;
    
    // Guestbook
    const guestbookRef = ref(database, 'guestbook');
    const guestbookMessages = document.getElementById('guestbook-messages');
    const guestName = document.getElementById('guest-name');
    const submitButton = document.getElementById('submit-message');

    // Donation
    const donationRef = ref(database, 'donations/totalAmount');
    const donationAmountDisplay = document.getElementById('donationAmountDisplay');
    const donationDoneDiv = document.querySelector('.donationDone');

    // Listen for changes in the donation amount and update the display
    onValue(donationRef, (snapshot) => {
        const amount = snapshot.val() || 0;
        donationAmountDisplay.innerText = amount.toLocaleString();
    });

    // Listen for new messages and display them
    onValue(guestbookRef, (snapshot) => {
        guestbookMessages.innerHTML = '';
        const names = [];
        snapshot.forEach((childSnapshot) => {
            const message = childSnapshot.val();
            if (message.name) {
                names.push(message.name);
            }
        });

        const obfuscateName = (name) => {
            if (name.length < 2) {
                return name;
            }
            else if (name.length == 2) {
                return name[0] + '*';
            }

            return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
        };

        const namesHtml = names.map(name => `<span>♥️ ${obfuscateName(name)}</span>`).join('');
        guestbookMessages.innerHTML = `<p>${namesHtml}</p>`;
    });

    // Handle message submission and donation
    const handleGuestbookSubmit = async () => {
        if (guestName.value.trim() === '') {
            alert('이름을 입력해주세요.');
            return;
        }

        const hasContributed = localStorage.getItem('hasContributed');

        // Push message to guestbook first
        try {
            await push(guestbookRef, {
                name: guestName.value,
                timestamp: serverTimestamp(),
            });
            guestName.value = '';
        } catch (error) {
            console.error("Error writing message: ", error);
            alert('메시지를 남기는 중 오류가 발생했습니다.');
            return; // Stop if message fails
        }

        // Then handle donation if not already done
        if (hasContributed) {
            return;
        }

        try {
            await runTransaction(donationRef, (currentData) => {
                return (currentData || 0) + 1;
            });

            localStorage.setItem('hasContributed', 'true');
            // donationDoneDiv.style.display = 'block';
        } catch (error) {
            console.error("Error processing donation: ", error);
            alert('기부금을 업데이트하는 중 오류가 발생했습니다.');
        }
    };

    submitButton.addEventListener('click', handleGuestbookSubmit);

    /* Petal Animation */
    const petalContainer = document.createElement('div');
    petalContainer.id = 'petal-container';
    document.body.appendChild(petalContainer);

    function createPetal() {
        const petal = document.createElement('div');
        petal.classList.add('petal');

        const animationDuration = Math.random() * 7 + 8; // 8 to 15 seconds
        const startPosition = Math.random() * window.innerWidth;

        petal.style.left = `${startPosition}px`;
        petal.style.animationDuration = `${animationDuration}s`;

        petal.addEventListener('animationend', () => {
            petal.style.animation = 'none';
        });

        petalContainer.appendChild(petal);
    }

    setInterval(createPetal, 3000);

    /* FAB and Particle Animation */
    const fab = document.getElementById('fab');

    fab.addEventListener('click', () => {
        document.querySelector('.guestbook').scrollIntoView({ behavior: 'smooth' });
    });

    /* Gallery */
    const galleryContainer = document.querySelector('.gallery-images');
    const imageViewer = document.getElementById('image-viewer');
    const fullImage = document.getElementById('full-image');
    const closeViewer = document.querySelector('.close-viewer');

    imageFiles.forEach(fileName => {
        const img = document.createElement('img');
        img.src = `assets/album/${fileName}`;
        img.alt = 'Wedding photo';
        galleryContainer.appendChild(img);

        img.addEventListener('click', () => {
            imageViewer.style.display = 'block';
            fullImage.src = img.src;
        });
    });

    closeViewer.addEventListener('click', () => {
        imageViewer.style.display = 'none';
    });

    imageViewer.addEventListener('click', (e) => {
        if (e.target === imageViewer) {
            imageViewer.style.display = 'none';
        }
    });

    /* Account Info Toggle */
    const accountToggles = document.querySelectorAll('.account-toggle');
    accountToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = toggle.dataset.target;
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                if (targetElement.style.display === 'block') {
                    targetElement.style.display = 'none';
                } else {
                    targetElement.style.display = 'block';
                }
            }
        });
    });
});