const img = document.querySelector('#photo');
const file = document.querySelector('#file');

document.addEventListener('DOMContentLoaded', function () {
  const savedImage = localStorage.getItem('profileImage');
  if (savedImage) {
    img.setAttribute('src', savedImage);
  }
});

file.addEventListener('change', function () {
  const chosenFile = this.files[0];

  if (chosenFile) {
    const reader = new FileReader();

    reader.addEventListener('load', function () {
      const imageData = reader.result;
      img.setAttribute('src', imageData);
      localStorage.setItem('profileImage', imageData);
    });

    reader.readAsDataURL(chosenFile);
  }
});

document.querySelectorAll('.toggle-password').forEach(icon => {
  icon.addEventListener('click', function () {
    const targetInput = document.getElementById(this.getAttribute('data-target'));

    if (targetInput.type === 'password') {
      targetInput.type = 'text';
      this.classList.replace('fa-eye', 'fa-eye-slash'); 
    } else {
      targetInput.type = 'password';
      this.classList.replace('fa-eye-slash', 'fa-eye'); 
    }
  });
});