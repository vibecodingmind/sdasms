'use client';

import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function TaxSettingView() {
  const [taxEnabled, setTaxEnabled] = useState(true);
  const [defaultRate, setDefaultRate] = useState('10');
  const [countryTaxes, setCountryTaxes] = useState<{ country: string; rate: string }[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSetRate = () => {
    if (saved) setSaved(false);
    setTimeout(() => setSaved(true), 100);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAddCountry = () => {
    if (!selectedCountry) return;
    setCountryTaxes((prev) => [...prev, { country: selectedCountry, rate: '10' }]);
    setSelectedCountry('');
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm max-w-3xl">
        <CardContent className="p-6 space-y-6">
          {/* Enable Tax Checkbox */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="tax-enabled"
              checked={taxEnabled}
              onCheckedChange={(checked) => setTaxEnabled(checked === true)}
              className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 mt-0.5"
            />
            <label htmlFor="tax-enabled" className="text-sm text-gray-700 cursor-pointer leading-relaxed">
              Enable Tax
            </label>
          </div>

          {taxEnabled && (
            <>
              {/* Default Tax Rate */}
              <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Specify a tax rate to apply to all your users payment
                </p>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 max-w-xs">
                    <Input
                      type="number"
                      value={defaultRate}
                      onChange={(e) => setDefaultRate(e.target.value)}
                      className="pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">%</span>
                  </div>
                  <Button
                    onClick={handleSetRate}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Set
                  </Button>
                </div>
              </div>

              {/* Country Specific Tax */}
              <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  If you want to set up a different tax rate for a country, specify it in the list below
                </p>
                <div className="flex items-center gap-3">
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tanzania">Tanzania</SelectItem>
                      <SelectItem value="Kenya">Kenya</SelectItem>
                      <SelectItem value="Uganda">Uganda</SelectItem>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      <SelectItem value="Nigeria">Nigeria</SelectItem>
                      <SelectItem value="South Africa">South Africa</SelectItem>
                      <SelectItem value="Ghana">Ghana</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleAddCountry}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    Add
                  </Button>
                </div>

                {/* Added country taxes */}
                {countryTaxes.length > 0 ? (
                  <div className="space-y-2">
                    {countryTaxes.map((ct, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white border border-gray-200 rounded-md px-4 py-2.5">
                        <span className="text-sm font-medium text-gray-700">{ct.country}</span>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            defaultValue={ct.rate}
                            className="w-20 h-8 text-sm text-right"
                          />
                          <span className="text-sm text-gray-400">%</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => setCountryTaxes((prev) => prev.filter((_, i) => i !== idx))}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-md px-4 py-3">
                    <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-700">No country added</p>
                  </div>
                )}
              </div>
            </>
          )}

          {saved && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
              <Info className="h-4 w-4" />
              Tax settings saved successfully!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
