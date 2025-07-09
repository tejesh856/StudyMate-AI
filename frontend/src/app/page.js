'use client';
import Link from 'next/link';
import Image from 'next/image';

const features = [
  {
    title: "AI-Powered Content",
    desc: "Input a topic or upload a PDF and get custom study guides, notes, and summaries tailored to your needs.",
    icon: "📚",
  },
  {
    title: "Quiz Generator",
    desc: "Practice with quizzes or generate your own exams for any topic instantly.",
    icon: "📝",
  },
  {
    title: "Progress Tracking",
    desc: "Visualize your learning journey and get personalized recommendations.",
    icon: "📈",
  },
  {
    title: "Video Learning",
    desc: "Convert PDFs or prompts into AI-generated video lectures.",
    icon: "🎥",
  },
  {
    title: "Student Dashboard",
    desc: "Manage your courses, history, quiz scores, and insights — all in one place.",
    icon: "📊",
  },
  {
    title: "Smart Suggestions",
    desc: "AI suggests new topics and concepts based on your strengths and weaknesses.",
    icon: "💡",
  }
];

const steps = [
  {
    title: "Sign Up",
    desc: "Create your free account and set up your learning profile.",
    icon: "👤",
  },
  {
    title: "Upload or Enter Topic",
    desc: "Type your topic or upload a PDF to get started.",
    icon: "📄",
  },
  {
    title: "Learn & Practice",
    desc: "Get AI-generated content, watch videos, and practice with quizzes.",
    icon: "🧠",
  },
  {
    title: "Track Progress",
    desc: "See your diagnostics, history, and get smart suggestions.",
    icon: "📊",
  }
];

const testimonials = [
  {
    name: "Aarav S.",
    text: "Studymate AI made my exam prep so much easier! The AI-generated notes and quizzes are spot on.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    name: "Priya K.",
    text: "I love the video lectures generated from my PDFs. It feels like having a personal tutor 24/7.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    name: "Rahul M.",
    text: "The dashboard and progress tracking keep me motivated. Highly recommended for all students!",
    avatar: "https://randomuser.me/api/portraits/men/65.jpg"
  }
];

const faqs = [
  {
    q: "Is Studymate AI free to use?",
    a: "Yes! You can get started for free. Premium features may be added in the future."
  },
  {
    q: "How does the AI generate content?",
    a: "We use advanced AI models to analyze your input and generate relevant study material, quizzes, and videos."
  },
  {
    q: "Can I use it for any subject?",
    a: "Absolutely! Studymate AI supports a wide range of subjects and topics."
  },
  {
    q: "Is my data secure?",
    a: "Yes, your data is encrypted and never shared with third parties."
  }
];

export default function Home() {

  return (
    <div className='flex-1 flex flex-col'>

      <section className="hero min-h-[90vh] bg-base-200 dark:bg-base-900 px-8 lg:px-24 py-24">
        <div className="hero-content flex-col-reverse lg:flex-row gap-12">

          {/* Text Content */}
          <div className="max-w-2xl text-center lg:text-left">
            <h2 style={{marginBottom: '4rem'}} className="text-4xl lg:text-5xl font-extrabold leading-tight">
              Empower Your Learning<br />
              <span className="text-primary dark:text-primary-focus">
          with AI-Powered Tools
        </span>
      </h2>
      <p className=" text-lg md:text-xl text-base-content dark:text-base-content/80">
        Generate study material, quizzes, diagnostics and more — simply type or upload content. Personalized, interactive, and always available.
      </p>

      {/* Buttons */}
      <div style={{marginTop: '2rem'}} className=" flex gap-4 flex-wrap justify-center lg:justify-start">
        <Link
        style={{paddingLeft: '1rem', paddingRight: '1rem'}}
          href="/signup"
          className="btn btn-primary btn-lg"
        >
          Get Started Free
        </Link>
        <button style={{paddingLeft: '1rem', paddingRight: '1rem'}} onClick={() => scrollToSection('features')} className="btn btn-outline btn-lg btn-secondary">Explore Features</button>

      </div>
    </div>

    {/* Image */}
    <div className="flex-1 flex justify-center">
      <Image
        src="/hero.jpg"
        height={1000}
        width={500}
        alt="Hero image"
        className="rounded-xl shadow-2xl max-h-[500px] w-auto"
      />
    </div>
  </div>
</section>

<section
style={{padding: '2rem 2rem',paddingBottom: '8rem'}}
  id="features"
  className=" md:px-12 lg:px-24 bg-base-200 dark:bg-base-900"
>
  <h3 style={{marginBottom: '4rem'}} className="text-4xl font-extrabold text-center text-base-content ">
    Key Features
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
    {features.map((feature, i) => (
      <div
        key={i}
        className="card border border-primary bg-base text-base-content shadow-xl rounded-3xl hover:scale-105 transition-transform duration-300"
      >
        <div className="card-body !p-6 items-center text-center">
          <div className="text-6xl mb-5">{feature.icon}</div>
          <h4 className="text-2xl font-semibold mb-3">{feature.title}</h4>
          <p className="opacity-90">{feature.desc}</p>
          <div className="badge badge-secondary !mt-6 !px-4 !py-3 text-lg rounded-full">
            New
          </div>
        </div>
      </div>
    ))}
  </div>
</section>


<section
style={{padding: '2rem 2rem',paddingTop: '2rem',paddingBottom: '8rem'}}
  id="how"
  className=" md:px-12 lg:px-24 bg-base-200 dark:bg-base-900"
>
  <h3 style={{marginBottom: '4rem'}} className="text-4xl font-extrabold text-center text-base-content ">
    How It Works
  </h3>

  <div className="flex flex-col md:flex-row justify-center items-center gap-14">
    {steps.map((step, i) => (
      <div key={i} className="relative flex items-center justify-center">
        {/* Connector Line */}
        {i < steps.length - 1 && (
          <div className="hidden md:block absolute right-[-5rem] top-1/2 transform -translate-y-1/2">
            <div className="w-24 h-1 bg-primary rounded-full"></div>
          </div>
        )}

        {/* Step Card */}
        <div style={{padding: '2rem 0.5rem'}} className="card bg-primary text-primary-content shadow-2xl w-full max-w-xs rounded-3xl overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
          <div className="card-body items-center text-center px-6 py-10">
            {/* Step Badge */}
            <div style={{borderRadius: '9999px',padding: '0.5rem 0.5rem'}} className="badge badge-secondary badge-lg absolute top-4 left-4">
              {i + 1}
            </div>

            {/* Icon */}
            <div className="w-20 h-20 mb-6 flex items-center justify-center text-4xl rounded-full bg-primary-content/20 text-primary-content">
              {step.icon}
            </div>

            {/* Title */}
            <h5 className="text-2xl font-semibold mb-2">{step.title}</h5>

            {/* Description */}
            <p className="text-primary-content/80">{step.desc}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>




<section
  id="testimonials"
  style={{padding: '5rem 1.5rem'}}
  className=" md:px-12 lg:px-24 bg-base-200 text-base-content"
>
  <h3 style={{marginBottom: '4rem'}} className="text-4xl font-extrabold text-center">
    What Students Say
  </h3>

  <div className="flex flex-col md:flex-row flex-wrap gap-10 justify-center items-center">
    {testimonials.map((t, i) => (
      <div
      style={{padding: '1rem'}}
        key={i}
        className="card max-w-md w-full bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl hover:scale-[1.02] transition duration-300"
      >
        <div className="card-body items-center text-center">
          <div className="avatar mb-4">
            <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src={t.avatar} alt={t.name} />
            </div>
          </div>
          <p style={{marginBottom:'1rem'}} className="text-lg italic text-base-content">
            “{t.text}”
          </p>
          <h5 className="font-bold text-primary">{t.name}</h5>
        </div>
      </div>
    ))}
  </div>
</section>

<section
style={{padding: '5rem 1.5rem'}}
  id="faq"
  className=" lg:px-24 bg-base-100 dark:bg-base-200 flex flex-col items-center justify-center"
>
  <h3 style={{marginBottom: '4rem'}} className="text-4xl font-bold text-center text-primary">
    Frequently Asked Questions
  </h3>

  <div className="max-w-3xl mx-auto flex flex-col items-center justify-center gap-8">
    {faqs.map((faq, i) => (
      <div
      style={{padding: '1rem'}}
        key={i}
        className="collapse collapse-arrow border border-primary bg-base-200 dark:bg-base-300 rounded-box shadow-lg"
      >
        <input type="checkbox" className="peer" />
        <div className="collapse-title text-lg font-medium text-primary peer-checked:text-secondary transition-colors">
          {faq.q}
        </div>
        <div className="collapse-content text-base-content dark:text-base-content/80">
          <p>{faq.a}</p>
        </div>
      </div>
    ))}
  </div>
</section>


<section style={{padding: '6rem 1.5rem'}} className="relative flex justify-center items-center md:px-12 lg:px-24 overflow-hidden bg-gradient-to-br from-primary to-secondary text-primary-content text-center  shadow-xl">
  <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>

  <div className="relative max-w-3xl mx-auto">
    <h3 style={{marginBottom: '1.5rem'}} className="text-4xl lg:text-5xl font-extrabold leading-tight drop-shadow-md">
      🚀 Ready to Supercharge Your Learning?
    </h3>
    <p style={{marginBottom: '2.5rem'}} className="text-lg md:text-xl font-medium opacity-90">
      Join thousands of smart students using <span className="font-bold text-secondary">Studymate AI</span> to learn smarter, not harder.
    </p>
    <Link style={{padding: '1rem 2rem'}}
      href="/signup"
      className="btn btn-primary text-white text-lg font-semibold rounded-full shadow-lg transition-transform duration-300 hover:scale-110 hover:shadow-2xl"
    >
      ✨ Get Started Free
    </Link>
  </div>
</section>


<footer className="bg-base-200 text-base-content border-t border-base-300">
  <div style={{padding:'2.5rem 1.5rem',margin:'0 auto'}} className="max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
    
    {/* Left Section: Branding */}
    <div className="text-center md:text-left">
      <p className="text-sm">
        © {new Date().getFullYear()} <span className="font-bold text-primary">Studymate AI</span>. All rights reserved.
      </p>
    </div>

    {/* Right Section: Navigation Links */}
    <nav className="flex gap-6 text-sm">
      <button onClick={() => scrollToSection('features')} className="link link-hover">Features</button>
      <button onClick={() => scrollToSection('faq')} className="link link-hover">FAQ</button>
    </nav>
  </div>
</footer>










    </div>
  );
}
