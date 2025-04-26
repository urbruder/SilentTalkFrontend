import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  link: string;
  color: "primary" | "secondary" | "accent";
  testimonial?: {
    text: string;
    author: string;
  };
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  link,
  color,
  testimonial
}: FeatureCardProps) {
  const colorVariants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary-500 text-white hover:bg-green-600",
    accent: "bg-accent-500 text-white hover:bg-violet-600"
  };
  
  const textColorVariants = {
    primary: "text-primary hover:text-primary/90",
    secondary: "text-secondary-500 hover:text-green-600",
    accent: "text-accent-500 hover:text-violet-600"
  };

  return (
    <motion.div 
      className="bg-background/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden transition-all hover:shadow-2xl"
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6">
        <div 
          className={cn(
            "flex items-center justify-center h-12 w-12 rounded-md text-white mb-4",
            colorVariants[color]
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
        <Link 
          href={link} 
          className={cn(
            "mt-4 inline-flex items-center",
            textColorVariants[color]
          )}
        >
          Learn more
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      
      {testimonial && (
        <div className="bg-muted px-6 py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-xs text-gray-600 font-medium">
                  {testimonial.author.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-foreground">
                "{testimonial.text}" - {testimonial.author}
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
