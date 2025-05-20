const jobListings = [
  {
    title: "Python Developer",
    company: "Intel Sdn Bhd",
    location: "Penang",
    description: "Responsible for developing scalable Python applications and systems...",
    links: [
      { text: "LinkedIn", url: "#" },
      { text: "Jobstreet", url: "#" }
    ]
  },
  {
    title: "Frontend Engineer",
    company: "Shopee",
    location: "Kuala Lumpur",
    description: "Develop and maintain UI components using React and TypeScript...",
    links: [
      { text: "LinkedIn", url: "#" },
      { text: "Jobstreet", url: "#" }
    ]
  },
  // Add more listings as needed
];

const container = document.getElementById("job-listings");

jobListings.forEach(job => {
  const card = document.createElement("div");
  card.className = "job-card";

  card.innerHTML = `
    <div style="display:flex; justify-content:space-between;">
      <h3>${job.title}</h3>
      <div class="location">${job.location}</div>
    </div>
    <div class="company">${job.company}</div>
    <div class="description">${job.description}</div>
    <div class="job-links">
      ${job.links.map(link => `<a href="${link.url}">${link.text}</a>`).join("")}
    </div>
  `;

  container.appendChild(card);
});
