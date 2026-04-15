'use client';

import React, { useState } from 'react';
import { Save, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function ThemeCustomizerView() {
  const [menuLayout, setMenuLayout] = useState('vertical');
  const [skin, setSkin] = useState('light');
  const [navbarColor, setNavbarColor] = useState('white');
  const [navbarType, setNavbarType] = useState('sticky');
  const [footerType, setFooterType] = useState('hidden');
  const [layoutWidth, setLayoutWidth] = useState('full');
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [showBreadcrumbs, setShowBreadcrumbs] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Theme Customizer</h1>
      </div>

      <Card className="border-0 shadow-sm max-w-2xl">
        <CardContent className="p-6 space-y-5">
          {/* Menu Layout */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-sm font-medium text-gray-700">Menu Layout <span className="text-red-500">*</span></label>
            <Select value={menuLayout} onValueChange={setMenuLayout} className="w-48">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="vertical">Vertical</SelectItem>
                <SelectItem value="horizontal">Horizontal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Skin */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-sm font-medium text-gray-700">Skin <span className="text-red-500">*</span></label>
            <Select value={skin} onValueChange={setSkin} className="w-48">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Navbar Color */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-sm font-medium text-gray-700">Navbar Color <span className="text-red-500">*</span></label>
            <Select value={navbarColor} onValueChange={setNavbarColor} className="w-48">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="white">White</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="brand">Brand</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Navbar Type */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-sm font-medium text-gray-700">Navbar Type <span className="text-red-500">*</span></label>
            <Select value={navbarType} onValueChange={setNavbarType} className="w-48">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sticky">Sticky</SelectItem>
                <SelectItem value="fixed">Fixed</SelectItem>
                <SelectItem value="static">Static</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Footer Type */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-sm font-medium text-gray-700">Footer Type <span className="text-red-500">*</span></label>
            <Select value={footerType} onValueChange={setFooterType} className="w-48">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="hidden">Hidden</SelectItem>
                <SelectItem value="show">Show</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Layout Width */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-sm font-medium text-gray-700">Layout Width <span className="text-red-500">*</span></label>
            <Select value={layoutWidth} onValueChange={setLayoutWidth} className="w-48">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full Width</SelectItem>
                <SelectItem value="boxed">Boxed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Menu Collapsed Toggle */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Menu Collapsed</label>
            </div>
            <Switch checked={menuCollapsed} onCheckedChange={setMenuCollapsed} className="data-[state=checked]:bg-indigo-500" />
          </div>

          {/* Warning for vertical-only option */}
          {menuLayout === 'horizontal' && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">Warning: this option only applies to the vertical layout</p>
            </div>
          )}

          {/* Show Breadcrumbs Toggle */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Show Breadcrumbs</label>
            </div>
            <Switch checked={showBreadcrumbs} onCheckedChange={setShowBreadcrumbs} className="data-[state=checked]:bg-indigo-500" />
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>

          {saved && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">
              Theme settings saved successfully!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
