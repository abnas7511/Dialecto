import React from 'react';
import { Github, Linkedin, Mail, UserCircle } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  mainRole: string;
  github?: string;
  linkedin?: string;
  email?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Muhammed Abnas",
    role: "CEO",
    mainRole: "Founder",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "abnas@dialecto.com"
  },
  {
    name: "Muhammed Imkan K M",
    role: "CTO",
    mainRole: "Co-founder",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "imkan@dialecto.com"
  },
  {
    name: "Ajmal J S",
    role: "Lead Developer",
    mainRole: "Co-founder",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "ajmal@dialecto.com"
  },
  {
    name: "Abhiram P Vasudevan",
    role: "Product Manager",
    mainRole: "Co-founder",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "abhiram@dialecto.com"
  }
];

export default function TeamSection() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-white mb-4">Meet Our Team</h2>
        <p className="text-gray-300 text-center mb-16 max-w-2xl mx-auto">
          Led by our founder and supported by an exceptional team of co-founders, we combine expertise in AI, linguistics, and software development to break down language barriers and preserve cultural heritage.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <div key={member.name} className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all group">
              <div className="w-32 h-32 mx-auto mb-4 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-purple-700/20 rounded-full" />
                <UserCircle className="w-full h-full text-purple-400 group-hover:text-purple-300 transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-white text-center mb-1">{member.name}</h3>
              <p className="text-purple-400 text-center mb-1">{member.mainRole}</p>
              <p className="text-gray-400 text-center text-sm mb-4">{member.role}</p>
              <div className="flex justify-center space-x-4">
                {member.github && (
                  <a href={member.github} className="text-gray-400 hover:text-purple-400 transition-colors">
                    <Github className="h-5 w-5" />
                  </a>
                )}
                {member.linkedin && (
                  <a href={member.linkedin} className="text-gray-400 hover:text-purple-400 transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                {member.email && (
                  <a href={`mailto:${member.email}`} className="text-gray-400 hover:text-purple-400 transition-colors">
                    <Mail className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}