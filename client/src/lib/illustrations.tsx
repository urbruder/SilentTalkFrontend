import { SVGProps } from "react";

export function AccessibilityIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 600"
      fill="none"
      {...props}
    >
      <circle cx="400" cy="300" r="250" fill="#EFF6FF" />
      <path 
        d="M400 200C433.137 200 460 173.137 460 140C460 106.863 433.137 80 400 80C366.863 80 340 106.863 340 140C340 173.137 366.863 200 400 200Z" 
        fill="#3B82F6" 
      />
      <path 
        d="M520 340H280C280 284.772 324.772 240 380 240H420C475.228 240 520 284.772 520 340Z" 
        fill="#3B82F6" 
        fillOpacity="0.7" 
      />
      <path 
        d="M400 520C488.366 520 560 448.366 560 360C560 271.634 488.366 200 400 200C311.634 200 240 271.634 240 360C240 448.366 311.634 520 400 520Z" 
        stroke="#3B82F6" 
        strokeWidth="10" 
        strokeLinecap="round" 
        strokeDasharray="20 20" 
      />
      <path 
        d="M320 380L360 420L480 300" 
        stroke="#10B981" 
        strokeWidth="15" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
}

export function SignLanguageIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 600"
      fill="none"
      {...props}
    >
      <circle cx="400" cy="300" r="250" fill="#EFF6FF" />
      <path 
        d="M400 150C447.234 150 485.899 188.665 485.899 235.899C485.899 283.133 447.234 321.798 400 321.798C352.766 321.798 314.101 283.133 314.101 235.899C314.101 188.665 352.766 150 400 150Z" 
        fill="#3B82F6" 
        fillOpacity="0.2" 
      />
      <path 
        d="M355 240L375 260M375 260L355 280M375 260H345" 
        stroke="#3B82F6" 
        strokeWidth="12" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <path 
        d="M445 240L425 260M425 260L445 280M425 260H455" 
        stroke="#3B82F6" 
        strokeWidth="12" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <path 
        d="M400 380H370C356.193 380 345 391.193 345 405V440H455V405C455 391.193 443.807 380 430 380H400Z" 
        fill="#3B82F6" 
      />
      <path 
        d="M300 440H500M400 320V380" 
        stroke="#3B82F6" 
        strokeWidth="10" 
        strokeLinecap="round" 
      />
      <path 
        d="M370 200C370 211.046 363.284 220 355 220C346.716 220 340 211.046 340 200C340 188.954 346.716 180 355 180C363.284 180 370 188.954 370 200Z" 
        fill="#3B82F6" 
      />
      <path 
        d="M460 200C460 211.046 453.284 220 445 220C436.716 220 430 211.046 430 200C430 188.954 436.716 180 445 180C453.284 180 460 188.954 460 200Z" 
        fill="#3B82F6" 
      />
    </svg>
  );
}

export function SpeechRecognitionIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 600"
      fill="none"
      {...props}
    >
      <circle cx="400" cy="300" r="250" fill="#EFF6FF" />
      <rect x="300" y="200" width="200" height="300" rx="20" fill="#3B82F6" fillOpacity="0.1" />
      <rect x="330" y="230" width="140" height="60" rx="10" fill="#3B82F6" fillOpacity="0.3" />
      <rect x="330" y="310" width="140" height="60" rx="10" fill="#10B981" fillOpacity="0.3" />
      <rect x="330" y="390" width="140" height="60" rx="10" fill="#3B82F6" fillOpacity="0.3" />
      <path 
        d="M400 150C420.091 150 436.364 166.273 436.364 186.364V250C436.364 270.091 420.091 286.364 400 286.364C379.909 286.364 363.636 270.091 363.636 250V186.364C363.636 166.273 379.909 150 400 150Z" 
        fill="#10B981" 
      />
      <path 
        d="M340 220V250C340 284.183 367.909 312.091 402.091 312.091C436.273 312.091 464.182 284.183 464.182 250V220" 
        stroke="#10B981" 
        strokeWidth="15" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <path 
        d="M400 312.091V350" 
        stroke="#10B981" 
        strokeWidth="15" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <path 
        d="M363.636 350H436.364" 
        stroke="#10B981" 
        strokeWidth="15" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <path 
        d="M520 250C520 250 570 300 570 350C570 377.614 547.614 400 520 400C492.386 400 470 377.614 470 350C470 300 520 250 520 250Z" 
        fill="#3B82F6" 
        fillOpacity="0.4" 
        stroke="#3B82F6" 
        strokeWidth="10" 
      />
      <path 
        d="M520 280C520 280 550 310 550 340C550 356.569 536.569 370 520 370C503.431 370 490 356.569 490 340C490 310 520 280 520 280Z" 
        fill="#3B82F6" 
      />
    </svg>
  );
}

export function TextToSpeechIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 600"
      fill="none"
      {...props}
    >
      <circle cx="400" cy="300" r="250" fill="#EFF6FF" />
      <rect x="250" y="200" width="300" height="200" rx="20" fill="#8B5CF6" fillOpacity="0.1" />
      <rect x="280" y="230" width="240" height="20" rx="10" fill="#8B5CF6" fillOpacity="0.4" />
      <rect x="280" y="270" width="180" height="20" rx="10" fill="#8B5CF6" fillOpacity="0.3" />
      <rect x="280" y="310" width="220" height="20" rx="10" fill="#8B5CF6" fillOpacity="0.4" />
      <rect x="280" y="350" width="160" height="20" rx="10" fill="#8B5CF6" fillOpacity="0.3" />
      <path 
        d="M600 300C600 300 640 340 640 380C640 402.091 622.091 420 600 420C577.909 420 560 402.091 560 380C560 340 600 300 600 300Z" 
        fill="#8B5CF6" 
        fillOpacity="0.6" 
      />
      <path 
        d="M560 230C560 230 620 290 620 350C620 384.183 591.853 412.091 557.671 412.091C523.488 412.091 495.342 384.183 495.342 350C495.342 290 560 230 560 230Z" 
        stroke="#8B5CF6" 
        strokeWidth="10" 
        strokeOpacity="0.4" 
        strokeLinecap="round" 
      />
      <path 
        d="M530 180C530 180 610 260 610 340C610 387.496 571.542 426 524.046 426C476.55 426 438.092 387.496 438.092 340C438.092 260 530 180 530 180Z" 
        stroke="#8B5CF6" 
        strokeWidth="10" 
        strokeOpacity="0.2" 
        strokeLinecap="round" 
      />
    </svg>
  );
}
