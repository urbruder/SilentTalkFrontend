import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  HandMetal, 
  Mic, 
  Volume2, 
  MessageCircle, 
  ArrowRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/feature-card";
import { 
  AccessibilityIllustration,
  SignLanguageIllustration, 
  SpeechRecognitionIllustration, 
  TextToSpeechIllustration 
} from "@/lib/illustrations";

export default function Home() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerItems = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="space-y-8"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <div>
                <motion.h1 
                  className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl"
                  variants={fadeInUp}
                >
                  <span className="block text-foreground">Bridge the Silence —</span>
                  <span className="block bg-gradient-to-r from-primary to-accent-500 bg-clip-text text-transparent">
                    Talk Without Words
                  </span>
                </motion.h1>
                <motion.p 
                  className="mt-6 text-xl text-muted-foreground max-w-3xl"
                  variants={fadeInUp}
                >
                  SilentTalk helps break communication barriers using advanced technology to translate between sign language, speech, and text.
                </motion.p>
              </div>
              
              <motion.div 
                className="flex flex-wrap gap-4"
                variants={staggerItems}
              >
                <motion.div variants={fadeInUp}>
                  <Button 
                    asChild
                    size="lg"
                    className="rounded-md bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:scale-105"
                  >
                    <Link href="/sign-language" className="inline-flex items-center">
                      <HandMetal className="mr-2 h-5 w-5" />
                      Sign Language
                    </Link>
                  </Button>
                </motion.div>
                
                <motion.div variants={fadeInUp}>
                  <Button
                    asChild
                    size="lg"
                    className="rounded-md bg-secondary-500 hover:bg-green-600 text-white transition-all hover:scale-105"
                  >
                    <Link href="/speech-to-text" className="inline-flex items-center">
                      <Mic className="mr-2 h-5 w-5" />
                      Speech-to-Text
                    </Link>
                  </Button>
                </motion.div>
                
                <motion.div variants={fadeInUp}>
                  <Button
                    asChild
                    size="lg"
                    className="rounded-md bg-accent-500 hover:bg-violet-600 text-white transition-all hover:scale-105"
                  >
                    <Link href="/text-to-speech" className="inline-flex items-center">
                      <Volume2 className="mr-2 h-5 w-5" />
                      Text-to-Speech
                    </Link>
                  </Button>
                </motion.div>
                
                <motion.div variants={fadeInUp}>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="rounded-md transition-all hover:scale-105"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Live Chat
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <AccessibilityIllustration className="w-full h-auto" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">Breaking Communication Barriers</h2>
            <p className="mt-4 text-xl text-muted-foreground">Our tools make communication accessible for everyone</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={HandMetal}
              title="Sign Language Recognition"
              description="Our AI recognizes sign language gestures and translates them into text in real-time."
              link="/sign-language"
              color="primary"
              testimonial={{
                text: "This tool has changed how I communicate with my students.",
                author: "Sarah K., Teacher"
              }}
            />
            
            <FeatureCard
              icon={Mic}
              title="Speech-to-Text Conversion"
              description="Convert spoken words to text instantly, making conversations accessible to everyone."
              link="/speech-to-text"
              color="secondary"
              testimonial={{
                text: "I can now follow classroom discussions easily.",
                author: "James T., Student"
              }}
            />
            
            <FeatureCard
              icon={Volume2}
              title="Text-to-Speech Synthesis"
              description="Transform written text into natural-sounding speech with customizable voices."
              link="/text-to-speech"
              color="accent"
              testimonial={{
                text: "This has helped me regain my voice after surgery.",
                author: "Michael R., User"
              }}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-background">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-primary">Create your account today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <Button size="lg" className="rounded-md">
              Sign up for free
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="ml-3 rounded-md"
            >
              Learn more
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
