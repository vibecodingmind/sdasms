'use client';

import React, { useState } from 'react';
import { Plus, X, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockSpamWords } from '@/lib/mock-data';

export function SpamWordsView() {
  const [words, setWords] = useState(mockSpamWords);
  const [newWord, setNewWord] = useState('');
  const [newCategory, setNewCategory] = useState('spam');
  const [search, setSearch] = useState('');

  const addWord = () => {
    if (newWord.trim()) {
      setWords([...words, { id: words.length + 1, word: newWord.toUpperCase(), category: newCategory }]);
      setNewWord('');
    }
  };

  const removeWord = (id: number) => {
    setWords(words.filter((w) => w.id !== id));
  };

  const filtered = words.filter((w) => w.word.includes(search.toUpperCase()) || w.category.includes(search.toLowerCase()));
  const categories = [...new Set(words.map((w) => w.category))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Spam Words</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage spam word filters</p>
      </div>

      {/* Add new */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input placeholder="Enter spam word..." value={newWord} onChange={(e) => setNewWord(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addWord()} className="flex-1" />
            <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
              <option value="spam">Spam</option>
              <option value="scam">Scam</option>
              <option value="phishing">Phishing</option>
              <option value="financial">Financial</option>
            </select>
            <Button className="bg-[#6366F1] hover:bg-[#5558E6] text-white shrink-0" onClick={addWord}><Plus className="h-4 w-4 mr-2" /> Add Word</Button>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <Input placeholder="Search spam words..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </CardContent>
      </Card>

      {/* Words by category */}
      <div className="space-y-4">
        {categories.map((cat) => {
          const catWords = filtered.filter((w) => w.category === cat);
          if (catWords.length === 0) return null;
          return (
            <Card key={cat} className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-gray-700 capitalize flex items-center gap-2">
                  <Tag className="h-4 w-4 text-[#6366F1]" />
                  {cat}
                  <Badge variant="secondary" className="text-[10px]">{catWords.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {catWords.map((w) => (
                    <span key={w.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-100">
                      {w.word}
                      <button onClick={() => removeWord(w.id)} className="hover:bg-red-200 rounded p-0.5 transition">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
