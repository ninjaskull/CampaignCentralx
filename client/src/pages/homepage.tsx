import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ChartLine, Upload, Table, ShieldCheck, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { setAuthToken } from "@/lib/auth";

export default function Homepage() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handlePasswordSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!password.trim()) {
      toast({
        title: "Password Required",
        description: "Please enter the access password",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const data = await response.json();
        setAuthToken(data.token);
        setLocation('/dashboard');
        toast({
          title: "Access Granted",
          description: "Welcome to Campaign Manager",
        });
      } else {
        toast({
          title: "Access Denied",
          description: "Invalid password. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Unable to connect to server. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePasswordSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ChartLine className="text-white text-sm" />
              </div>
              <h1 className="text-xl font-semibold text-slate-900">Campaign Manager</h1>
            </div>
            
            {/* Password Authentication Input */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  type="password"
                  placeholder="Enter access password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-64 pl-10 pr-12 bg-white"
                  disabled={isLoading}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Button
                  size="sm"
                  onClick={handlePasswordSubmit}
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 px-3 text-xs"
                >
                  {isLoading ? "..." : "Access"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Secure Campaign Data Management
          </h2>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Upload, organize, and analyze your campaign CSV files in a secure, 
            spreadsheet-like interface. Advanced field mapping and data visualization 
            tools for marketing professionals.
          </p>
          
          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <Card className="border border-slate-200">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Upload className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Smart CSV Upload</h3>
                <p className="text-slate-600 text-sm">
                  Automatic field detection with manual mapping for custom headers. 
                  Supports all standard campaign data fields.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-slate-200">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Table className="text-emerald-600 h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Spreadsheet Interface</h3>
                <p className="text-slate-600 text-sm">
                  View and analyze your data in a familiar Google Sheets-like interface 
                  with filtering and search capabilities.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-slate-200">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="text-purple-600 h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Enterprise Security</h3>
                <p className="text-slate-600 text-sm">
                  End-to-end encryption, secure storage, and password protection 
                  keep your campaign data safe and compliant.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
