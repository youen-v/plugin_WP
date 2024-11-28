function loadingProgress() {
  const progressFill = document.getElementById("progress-fill");
  const progressPercentage = document.getElementById("progress-percentage");

  // Durée de l'animation (en secondes)
  const animationDuration = 1; // Changez ici pour ajuster la durée

  // Fonction d'animation
  let progress = 0;
  const interval = setInterval(() => {
    progress += 1; // Incrément de 1% par intervalle
    progressFill.style.width = `${progress}%`; // Ajuste la largeur
    progressPercentage.textContent = `${progress}%`; // Affiche le pourcentage

    if (progress >= 100) {
      clearInterval(interval); // Arrête l'animation à 100%
    }
  }, (animationDuration * 1000) / 100); // Durée totale divisée en 100 étapes
}

let bucket = [];
const priceArray = {
  Logo: "50",
  "Carte de Visite": "150",
  Affiche: "100",
  "Shooting photo": "200",
  "Photo Produit": "250",
  "Photo évènements": "300",
  Clip: "350",
  "Montage Vidéo": "400",
  "Film d'entreprise": "450",
  "Vidéo réseaux sociaux": "500",
  Publicité: "550",
  "Site Web": "600",
  Maquette: "650",
  Hébergement: "700",
  "Optimisation UI/UX": "750",
  "Refont site web": "800",
};
document.addEventListener("DOMContentLoaded", () => {
  const resetPdf = document.querySelector("div.crossBtn");
  const sendBucket = document.querySelector("button[type=submit]");
  sendBucket.addEventListener("click", (event) => {
    event.preventDefault();

    const iframe = document.getElementById("pdf");
    const modal = document.getElementById("modalPdf");
    const loading = document.createElement("div");
    loading.classList.add("loading");
    modal.appendChild(loading);

    const progressContainer = document.createElement("div");
    progressContainer.classList.add("progress-container");
    loading.appendChild(progressContainer);

    const progressText = document.createElement("div");
    progressText.classList.add("progress-text");
    progressText.innerText = "LOADING...";
    progressContainer.appendChild(progressText);

    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
    progressContainer.appendChild(progressBar);

    const progressFill = document.createElement("div");
    progressFill.classList.add("progress-fill");
    progressFill.setAttribute("id", "progress-fill");
    progressBar.appendChild(progressFill);

    const progressPourcentage = document.createElement("span");
    progressPourcentage.classList.add("progress-percentage");
    progressPourcentage.setAttribute("id", "progress-percentage");
    progressPourcentage.innerText = "0%";
    progressFill.appendChild(progressPourcentage);

    iframe.classList.add("display");
    loadingProgress();

    setTimeout(() => {
      loading.remove();
      iframe.classList.remove("display");
      const getBucket = Array.from(document.querySelectorAll("div.item"));
      getBucket.forEach((element) => {
        bucket.push(element.id);
      });
      createPdf();
    }, 3000);

    if (innerWidth < 1024) {
      resetPdf.click();
    }
  });

  resetPdf.addEventListener("click", () => {
    bucket = [];
  });
});

async function createPdf() {
  const grisClair = PDFLib.rgb(0.827, 0.827, 0.827);
  const grisMoyen = PDFLib.rgb(0.502, 0.502, 0.502);
  const grisFonce = PDFLib.rgb(0.251, 0.251, 0.251);

  // Créer un nouveau document PDF
  const pdfDoc = await PDFLib.PDFDocument.create();

  // Ajouter une page avec les dimensions souhaitées (par exemple, 595x842 pour A4)
  const page = pdfDoc.addPage([1832, 1220]);

  const imageBytes = await fetch("/plugin_WP/assets/imagePdf.png").then((res) =>
    res.arrayBuffer()
  );
  // Intégrer l'image dans le PDF
  const pngImage = await pdfDoc.embedPng(imageBytes);
  // Obtenez les dimensions originales de l'image
  const { width: imgWidth, height: imgHeight } = pngImage;

  // Dimensions de la page PDF
  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();

  // Calculer le facteur d'échelle pour que l'image remplisse l'iframe tout en conservant ses proportions
  const scale = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);

  // Dimensions ajustées de l'image
  const scaledWidth = imgWidth * scale;
  const scaledHeight = imgHeight * scale;

  // Centrer l'image sur la page
  const x = (pageWidth - scaledWidth) / 2;
  const y = (pageHeight - scaledHeight) / 2;

  // Dessiner l'image sur la page
  page.drawImage(pngImage, {
    x: 0, // Coordonnée X
    y: 0, // Coordonnée Y
    width: scaledWidth, // Largeur de l'image
    height: scaledHeight, // Hauteur de l'image
  });
  let positionY = 720;
  let totalPrice = 0;
  for (let solution in bucket) {
    let solutionTxt = bucket[solution];
    let priceTxt = priceArray[solutionTxt];

    // Dessiner un rectangle en bordure
    page.drawRectangle({
      x: 730,
      y: positionY,
      width: 260,
      height: 40,
      borderColor: grisMoyen,
      borderWidth: 1,
    });
    // solution à inserer
    page.drawText(`${solutionTxt}`, {
      x: 790,
      y: (positionY += 15),
      size: 20,
      color: grisFonce,
    });

    page.drawRectangle({
      x: 990,
      y: (positionY -= 15),
      width: 140,
      height: 40,
      borderColor: grisMoyen,
      borderWidth: 1,
    });

    // total solution a inserer
    page.drawText(`${priceTxt} €`, {
      x: 1030,
      y: (positionY += 15),
      size: 20,
      color: grisFonce,
    });
    totalPrice += parseInt(priceTxt, 10);
    positionY -= 55;
  }

  // encars total devis
  page.drawRectangle({
    x: 580,
    y: 85,
    width: 680,
    height: 25,
    color: grisClair,
    borderWidth: 1,
    borderColor: grisFonce,
  });
  page.drawText(`Total : ${totalPrice} €`, {
    x: 1080,
    y: 90,
    size: 20,
    color: grisFonce,
  });
  // Générer le PDF en base64 et afficher dans un iframe
  const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
  document.getElementById("pdf").src = pdfDataUri;

  if (innerWidth < 1024) {
    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes], { type: "application/pdf" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "cynectstudio.pdf";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  }
}
