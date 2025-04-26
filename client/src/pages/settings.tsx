import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/use-theme";
import { AvatarPlaceholder } from "@/components/ui/avatar-placeholder";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [formData, setFormData] = useState({
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@example.com",
    appLanguage: "en-US",
    textSize: "medium",
  });

  const [features, setFeatures] = useState({
    darkMode: theme === "dark",
    offlineMode: true,
    notifications: true,
    dataCollection: false,
    highContrast: false,
    reduceMotion: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (name: string) => {
    setFeatures((prev) => {
      const updatedFeatures = {
        ...prev,
        [name]: !prev[name as keyof typeof prev],
      };
      
      // Handle special case for dark mode toggle
      if (name === "darkMode") {
        setTheme(updatedFeatures.darkMode ? "dark" : "light");
      }
      
      return updatedFeatures;
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="mt-2 text-lg text-muted-foreground">Customize your SilentTalk experience</p>
      </div>

      <Card className="bg-background/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden">
        <div className="divide-y divide-border">
          {/* Account Settings */}
          <div className="px-4 py-6 sm:p-6">
            <div>
              <h2 id="account-settings-heading" className="text-lg font-medium text-foreground">Account Settings</h2>
              <p className="mt-1 text-sm text-muted-foreground">Manage your profile and account preferences</p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <div className="mt-1 flex items-center">
                  <AvatarPlaceholder initials="JD" size="lg" />
                  <div className="ml-4">
                    <Button variant="outline" size="sm">
                      Change
                    </Button>
                    <Button variant="outline" size="sm" className="ml-2">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-3">
                <Label htmlFor="first-name">First name</Label>
                <Input
                  type="text"
                  name="firstName"
                  id="first-name"
                  autoComplete="given-name"
                  className="mt-1"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="sm:col-span-3">
                <Label htmlFor="last-name">Last name</Label>
                <Input
                  type="text"
                  name="lastName"
                  id="last-name"
                  autoComplete="family-name"
                  className="mt-1"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="sm:col-span-6">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="mt-1"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* App Settings */}
          <div className="px-4 py-6 sm:p-6">
            <div>
              <h2 id="app-settings-heading" className="text-lg font-medium text-foreground">App Settings</h2>
              <p className="mt-1 text-sm text-muted-foreground">Customize your application experience</p>
            </div>

            <div className="mt-6 space-y-6">
              <div className="flex items-center justify-between">
                <span className="flex-grow flex flex-col">
                  <span className="text-sm font-medium text-foreground">Dark Mode</span>
                  <span className="text-sm text-muted-foreground">Switch between light and dark themes</span>
                </span>
                <Switch 
                  checked={features.darkMode}
                  onCheckedChange={() => handleSwitchChange("darkMode")}
                  aria-label="Toggle dark mode"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="flex-grow flex flex-col">
                  <span className="text-sm font-medium text-foreground">Offline Mode</span>
                  <span className="text-sm text-muted-foreground">Use app when you're not connected</span>
                </span>
                <Switch 
                  checked={features.offlineMode}
                  onCheckedChange={() => handleSwitchChange("offlineMode")}
                  aria-label="Toggle offline mode"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="flex-grow flex flex-col">
                  <span className="text-sm font-medium text-foreground">Notifications</span>
                  <span className="text-sm text-muted-foreground">Receive alerts and updates</span>
                </span>
                <Switch 
                  checked={features.notifications}
                  onCheckedChange={() => handleSwitchChange("notifications")}
                  aria-label="Toggle notifications"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="flex-grow flex flex-col">
                  <span className="text-sm font-medium text-foreground">Data Collection</span>
                  <span className="text-sm text-muted-foreground">Help improve our services</span>
                </span>
                <Switch 
                  checked={features.dataCollection}
                  onCheckedChange={() => handleSwitchChange("dataCollection")}
                  aria-label="Toggle data collection"
                />
              </div>
            </div>
          </div>

          {/* Language & Accessibility */}
          <div className="px-4 py-6 sm:p-6">
            <div>
              <h2 id="language-settings-heading" className="text-lg font-medium text-foreground">Language & Accessibility</h2>
              <p className="mt-1 text-sm text-muted-foreground">Customize language and accessibility options</p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <Label htmlFor="app-language">App Language</Label>
                <Select 
                  value={formData.appLanguage}
                  onValueChange={(value) => handleSelectChange("appLanguage", value)}
                >
                  <SelectTrigger id="app-language" className="mt-1">
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="es-ES">Spanish</SelectItem>
                    <SelectItem value="fr-FR">French</SelectItem>
                    <SelectItem value="de-DE">German</SelectItem>
                    <SelectItem value="ja-JP">Japanese</SelectItem>
                    <SelectItem value="zh-CN">Mandarin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="sm:col-span-3">
                <Label htmlFor="text-size">Text Size</Label>
                <Select 
                  value={formData.textSize}
                  onValueChange={(value) => handleSelectChange("textSize", value)}
                >
                  <SelectTrigger id="text-size" className="mt-1">
                    <SelectValue placeholder="Select text size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="xl">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="sm:col-span-6">
                <div className="flex items-center justify-between">
                  <span className="flex-grow flex flex-col">
                    <span className="text-sm font-medium text-foreground">High Contrast Mode</span>
                    <span className="text-sm text-muted-foreground">Increase visual distinction between elements</span>
                  </span>
                  <Switch 
                    checked={features.highContrast}
                    onCheckedChange={() => handleSwitchChange("highContrast")}
                    aria-label="Toggle high contrast mode"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <div className="flex items-center justify-between">
                  <span className="flex-grow flex flex-col">
                    <span className="text-sm font-medium text-foreground">Reduce Motion</span>
                    <span className="text-sm text-muted-foreground">Minimize animations and transitions</span>
                  </span>
                  <Switch 
                    checked={features.reduceMotion}
                    onCheckedChange={() => handleSwitchChange("reduceMotion")}
                    aria-label="Toggle reduce motion"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="px-4 py-6 sm:p-6 bg-muted flex justify-end">
            <Button type="button" className="ml-3">
              Save Changes
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
