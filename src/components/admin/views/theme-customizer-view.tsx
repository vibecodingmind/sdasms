'use client';

import React, { useState } from 'react';
import { Palette, RotateCcw, Save, Sun, Moon, Monitor, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export function ThemeCustomizerView() {
  const [primaryColor, setPrimaryColor] = useState('#6366F1');
  const [sidebarStyle, setSidebarStyle] = useState<'light' | 'dark'>('light');
  const [saved, setSaved] = useState(false);
  const [activeFont, setActiveFont] = useState('Inter');

  const colors = [
    { name: 'Indigo', value: '#6366F1' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Teal', value: '#14B8A6' },
    { name: 'Orange', value: '#F97316' },
    { name: 'Pink', value: '#EC4899' },
  ];

  const fonts = ['Inter', 'Poppins', 'Roboto', 'Open Sans', 'Nunito', 'Lato'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Theme Customizer</h1>
        <p className="text-sm text-gray-500 mt-0.5">Customize the look and feel of your admin panel</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Primary Color */}
          <Card className="border-0 shadow-sm">
            <CardHeader><CardTitle className="text-base">Primary Color</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3 mb-4">
                {colors.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setPrimaryColor(c.value)}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      primaryColor === c.value ? 'border-gray-800 scale-110 shadow-md' : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  >
                    {primaryColor === c.value && <Check className="h-4 w-4 text-white mx-auto" />}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">Custom:</label>
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded border border-gray-200 cursor-pointer"
                />
                <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-32 font-mono text-sm" />
              </div>
            </CardContent>
          </Card>

          {/* Font */}
          <Card className="border-0 shadow-sm">
            <CardHeader><CardTitle className="text-base">Typography</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {fonts.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFont(f)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                      activeFont === f
                        ? 'border-[#6366F1] bg-[#EEF2FF] text-[#6366F1]'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                    style={{ fontFamily: f.toLowerCase() }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <Card className="border-0 shadow-sm">
            <CardHeader><CardTitle className="text-base">Sidebar Style</CardTitle></CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <button
                  onClick={() => setSidebarStyle('light')}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    sidebarStyle === 'light' ? 'border-[#6366F1] bg-[#EEF2FF]' : 'border-gray-200'
                  }`}
                >
                  <Sun className="h-5 w-5 text-yellow-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700 text-center">Light</p>
                </button>
                <button
                  onClick={() => setSidebarStyle('dark')}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    sidebarStyle === 'dark' ? 'border-[#6366F1] bg-[#EEF2FF]' : 'border-gray-200'
                  }`}
                >
                  <Moon className="h-5 w-5 text-gray-700 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700 text-center">Dark</p>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Logo */}
          <Card className="border-0 shadow-sm">
            <CardHeader><CardTitle className="text-base">Logo Upload</CardTitle></CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#6366F1] transition-colors cursor-pointer">
                <Palette className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 font-medium">Click to upload logo</p>
                <p className="text-xs text-gray-400 mt-1">SVG, PNG, or JPG (max 2MB)</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button className="bg-[#6366F1] hover:bg-[#5558E6] text-white flex-1" onClick={() => setSaved(true)}>
              <Save className="h-4 w-4 mr-2" /> Save Theme
            </Button>
            <Button variant="outline" className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2" /> Reset to Default
            </Button>
          </div>

          {saved && (
            <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg">
              Theme settings saved successfully!
            </div>
          )}
        </div>

        {/* Preview */}
        <Card className="border-0 shadow-sm h-fit lg:sticky lg:top-6">
          <CardHeader><CardTitle className="text-base">Preview</CardTitle></CardHeader>
          <CardContent>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Mini sidebar */}
              <div className={`h-full w-16 ${sidebarStyle === 'light' ? 'bg-gray-100' : 'bg-gray-900'} p-2 space-y-2`}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-6 rounded ${i === 1 ? 'bg-[#6366F1]' : sidebarStyle === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`} />
                ))}
              </div>
              {/* Mini content */}
              <div className="p-3 space-y-2 bg-white">
                <div className="h-3 w-24 bg-gray-200 rounded" />
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-12 rounded-lg bg-gray-50 border border-gray-100 p-2">
                      <div className="w-5 h-5 rounded-full mb-1" style={{ backgroundColor: primaryColor }} />
                      <div className="h-1.5 w-full bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
                <div className="h-16 rounded-lg bg-gray-50 border border-gray-100 mt-2" />
                <div className="h-1.5 w-3/4 bg-gray-200 rounded mt-2" />
                <div className="h-1.5 w-1/2 bg-gray-200 rounded" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
