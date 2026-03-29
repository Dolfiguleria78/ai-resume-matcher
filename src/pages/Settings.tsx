import { Moon, Sun, Cpu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";

export default function Settings() {
  const [dark, setDark] = useState(document.documentElement.classList.contains("dark"));

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setDark(!dark);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground mb-8">Customize your experience</p>

          <div className="space-y-6">
            {/* Theme */}
            <GlassCard>
              <div className="flex items-center gap-3 mb-4">
                {dark ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
                <h2 className="font-semibold">Appearance</h2>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Dark Mode</Label>
                  <p className="text-xs text-muted-foreground">Switch between light and dark themes</p>
                </div>
                <Switch checked={dark} onCheckedChange={toggleTheme} />
              </div>
            </GlassCard>

            {/* AI Model */}
            <GlassCard>
              <div className="flex items-center gap-3 mb-4">
                <Cpu className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">AI Model</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="font-medium">Analysis Model</Label>
                  <p className="text-xs text-muted-foreground mb-2">Choose the AI model for resume analysis</p>
                  <Select defaultValue="flash">
                    <SelectTrigger className="bg-secondary/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flash">Gemini Flash — Fast & efficient</SelectItem>
                      <SelectItem value="pro">Gemini Pro — Best quality</SelectItem>
                      <SelectItem value="gpt5">GPT-5 — Most capable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Auto-optimize</Label>
                    <p className="text-xs text-muted-foreground">Automatically apply AI suggestions</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </GlassCard>

            <div className="flex justify-end">
              <Button className="gradient-primary text-primary-foreground border-0 hover:opacity-90">
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
