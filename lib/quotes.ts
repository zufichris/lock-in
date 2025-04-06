import { Quote } from "@/components/particle-background"

export const motivationalQuotes: Quote[] = [
  {
    text: "No cap, you gotta lock in and stay focused on the grind. The bag ain't gonna secure itself.",
    author: "Hustle Mindset",
  },
  {
    text: "Respectfully, if you ain't putting in that work, don't be surprised when you stay mid. Lock in!",
    author: "Grind Culture",
  },
  {
    text: "It's giving main character energy when you lock in and ignore the opps. Stay toxic to negativity.",
    author: "Success Vibes",
  },
  {
    text: "Finna be great, no debate. When you lock in, the universe better watch out, fr fr.",
    author: "Winning Mentality",
  },
  {
    text: "Straight bussin' when you lock in and achieve your goals. That's real tea, no shade.",
    author: "Achievement Unlocked",
  },
  {
    text: "Sheeesh! When you lock in, you different. They sleep, you grind. Period, pooh.",
    author: "Grind Different",
  },
  {
    text: "On God, when you lock in and focus, you're literally that girl/guy. Big flex energy.",
    author: "Focus Mode",
  },
  {
    text: "It's the locking in for me. Rent was due yesterday, and the grind don't stop. We outside!",
    author: "Hustle Hard",
  },
  {
    text: "Deadass, when you lock in, you unlock levels they ain't even heard of yet. Stay toxic productive.",
    author: "Level Up",
  },
  {
    text: "Ain't no way you're not gonna succeed when you lock in. That's just facts, no printer.",
    author: "Success Mindset",
  },
]

export async function getRandomQuote(): Promise<Quote> {
  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length)
  return motivationalQuotes[randomIndex]
}

const images = [
  "https://i.pinimg.com/474x/84/17/14/84171495621447c8dc672968e27a6cf4.jpg",
  "https://i.pinimg.com/474x/8c/9b/07/8c9b07e5f25b7776190bf9de4da60c47.jpg",
  "https://i.pinimg.com/474x/a5/e2/55/a5e255b0fe8d64fd9178b912069c13c4.jpg",
  "https://i.pinimg.com/474x/77/3d/e8/773de85e694e8f88ed08ff5509ae4355.jpg",
  "https://i.pinimg.com/474x/35/9a/c9/359ac9da2cd64de80476bd7f10f78e13.jpg",
  "https://i.pinimg.com/474x/2d/3b/57/2d3b57d36444ca96ad5aa7a0ffba15ec.jpg",
  "https://i.pinimg.com/474x/7b/3a/b2/7b3ab281297ae937887b08b75f775a9d.jpg",
  "https://i.pinimg.com/736x/e3/75/51/e375513bcedd98cce4026eb8ecdd6406.jpg",
  "https://i.pinimg.com/736x/7f/f6/a2/7ff6a216eeaf4f1f2517e0780453971f.jpg",
  "https://i.pinimg.com/474x/db/52/30/db5230cc9239e3e4a53c7b93785c3837.jpg",
  "https://i.pinimg.com/474x/53/a7/cf/53a7cf6366704c3dd4d4b47352052b5f.jpg",
  "https://i.pinimg.com/474x/bb/27/15/bb2715148748084d037f7d7b036402e6.jpg",
  "https://i.pinimg.com/474x/66/88/98/6688984d7dc04587997a249c77c2836e.jpg",
  "https://i.pinimg.com/474x/84/df/5f/84df5f068a75d0e67f4bac08c9f2df2f.jpg",
  "https://i.pinimg.com/474x/52/2e/2d/522e2df4da526f76711e067b971b7696.jpg",
  "https://i.pinimg.com/474x/f4/80/bb/f480bb585117978f638e148a5f38a558.jpg",
  "https://i.pinimg.com/474x/06/35/bf/0635bf6e3bbbe6d85b0f167c3ade5614.jpg",
  "https://i.pinimg.com/474x/87/43/e6/8743e6f81ca488f8c73715f314c5fb0f.jpg",
  "https://i.pinimg.com/736x/f0/0f/74/f00f747ad5747857791af751e4bdf36d.jpg",
  "https://i.pinimg.com/474x/4d/92/5f/4d925f966849fbf32abdf49567fd17b1.jpg",
  "https://i.pinimg.com/474x/03/af/dd/03afdde0dd654c2d1d2c21bc2efef986.jpg",
  "https://i.pinimg.com/474x/b1/45/08/b14508bd52f8ab1ec8dc0a111b9c1b22.jpg",
  "https://i.pinimg.com/474x/f4/8f/c1/f48fc1fbfd4189d90d4f62125cc6b540.jpg",
  "https://i.pinimg.com/474x/22/89/af/2289afd3e39dfa1409cb66ef9736259d.jpg",
  "https://i.pinimg.com/474x/8c/db/a8/8cdba8f9cecb0e56e7492ff7cef5670c.jpg",
  "https://i.pinimg.com/474x/21/91/7b/21917bbdabf30b41b3bab498d4a4f373.jpg",
  "https://i.pinimg.com/474x/9b/53/45/9b5345ff7610443dcb92b5156b96b874.jpg"
]

export async function  shuffleImages() {
  const shuffled = [...images]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
export const calculateDaysLeft = (deadline: string): number | null => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const parts = deadline.split('-');
    if (parts.length !== 3) return null;
    // Use UTC dates to avoid timezone issues when comparing just dates
    const deadlineDate = new Date(Date.UTC(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));
    if (isNaN(deadlineDate.getTime())) return null;
    // Get today's date in UTC for comparison
    const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));

    const diffTime = deadlineDate.getTime() - todayUTC.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  } catch (error) {
    console.error("Error calculating days left:", error);
    return null;
  }
};
