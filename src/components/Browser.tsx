import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
}

interface HistoryItem {
  id: string;
  title: string;
  url: string;
  timestamp: Date;
  favicon?: string;
}

interface Bookmark {
  id: string;
  title: string;
  url: string;
  folder?: string;
  favicon?: string;
}

const Browser = () => {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', title: 'Homepage', url: 'https://example.com' },
  ]);
  const [activeTabId, setActiveTabId] = useState('1');
  const [urlInput, setUrlInput] = useState('https://example.com');
  const [history, setHistory] = useState<HistoryItem[]>([
    { id: '1', title: 'Example Domain', url: 'https://example.com', timestamp: new Date() },
    { id: '2', title: 'GitHub', url: 'https://github.com', timestamp: new Date(Date.now() - 3600000) },
    { id: '3', title: 'Stack Overflow', url: 'https://stackoverflow.com', timestamp: new Date(Date.now() - 7200000) },
  ]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([
    { id: '1', title: 'GitHub', url: 'https://github.com', folder: 'Dev' },
    { id: '2', title: 'MDN Web Docs', url: 'https://developer.mozilla.org', folder: 'Dev' },
    { id: '3', title: 'Google', url: 'https://google.com', folder: 'Search' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [primaryColor, setPrimaryColor] = useState('#2563EB');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const addNewTab = () => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: 'New Tab',
      url: 'https://example.com',
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
    setUrlInput(newTab.url);
  };

  const closeTab = (tabId: string) => {
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    if (newTabs.length === 0) {
      addNewTab();
      return;
    }
    setTabs(newTabs);
    if (activeTabId === tabId) {
      setActiveTabId(newTabs[0].id);
      setUrlInput(newTabs[0].url);
    }
  };

  const navigateToUrl = (url: string) => {
    const updatedTabs = tabs.map(tab =>
      tab.id === activeTabId ? { ...tab, url, title: url.split('/')[2] || 'Page' } : tab
    );
    setTabs(updatedTabs);
    
    const newHistoryItem: HistoryItem = {
      id: Date.now().toString(),
      title: url.split('/')[2] || 'Page',
      url,
      timestamp: new Date(),
    };
    setHistory([newHistoryItem, ...history]);
  };

  const addBookmark = () => {
    const activeTab = tabs.find(tab => tab.id === activeTabId);
    if (!activeTab) return;

    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      title: activeTab.title,
      url: activeTab.url,
    };
    setBookmarks([...bookmarks, newBookmark]);
  };

  const deleteBookmark = (bookmarkId: string) => {
    setBookmarks(bookmarks.filter(b => b.id !== bookmarkId));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const filteredHistory = history.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBookmarks = bookmarks.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto p-4 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Icon name="Globe" className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Custom Browser
            </h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              <Icon name={theme === 'light' ? 'Moon' : 'Sun'} size={18} />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setSettingsOpen(true)}>
              <Icon name="Settings" size={18} />
            </Button>
          </div>
        </div>

        <Card className="mb-4 overflow-hidden border-2 shadow-lg">
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-b">
            <div className="flex items-center gap-1 p-2 overflow-x-auto">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-t-lg cursor-pointer transition-all min-w-[140px] max-w-[200px] group ${
                    activeTabId === tab.id
                      ? 'bg-background shadow-md -mb-px border-t border-x'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  onClick={() => {
                    setActiveTabId(tab.id);
                    setUrlInput(tab.url);
                  }}
                >
                  <Icon name="Globe" size={14} className="text-muted-foreground flex-shrink-0" />
                  <span className="text-sm truncate flex-1">{tab.title}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(tab.id);
                    }}
                  >
                    <Icon name="X" size={12} />
                  </Button>
                </div>
              ))}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 flex-shrink-0"
                onClick={addNewTab}
              >
                <Icon name="Plus" size={18} />
              </Button>
            </div>
          </div>

          <div className="p-4 bg-background">
            <div className="flex gap-2 mb-4">
              <Button variant="outline" size="icon" className="flex-shrink-0">
                <Icon name="ChevronLeft" size={18} />
              </Button>
              <Button variant="outline" size="icon" className="flex-shrink-0">
                <Icon name="ChevronRight" size={18} />
              </Button>
              <Button variant="outline" size="icon" className="flex-shrink-0">
                <Icon name="RotateCw" size={18} />
              </Button>
              <div className="flex-1 relative">
                <Input
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      navigateToUrl(urlInput);
                    }
                  }}
                  className="pl-10 pr-10"
                  placeholder="Enter URL or search..."
                />
                <Icon
                  name="Lock"
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-accent"
                />
                <Icon
                  name="Search"
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
              </div>
              <Button variant="outline" size="icon" onClick={addBookmark}>
                <Icon name="Star" size={18} />
              </Button>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-lg p-12 text-center border-2 border-dashed">
              <Icon name="Globe" size={64} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">{activeTab?.title}</h3>
              <p className="text-sm text-muted-foreground">{activeTab?.url}</p>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="bookmarks" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="bookmarks" className="flex items-center gap-2">
              <Icon name="Star" size={16} />
              Закладки
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Icon name="Clock" size={16} />
              История
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Icon name="Settings" size={16} />
              Настройки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookmarks">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Закладки</h3>
                <Input
                  placeholder="Поиск закладок..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-xs"
                />
              </div>
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {filteredBookmarks.map((bookmark) => (
                    <div
                      key={bookmark.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Icon name="Star" size={16} className="text-accent flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{bookmark.title}</p>
                          <p className="text-sm text-muted-foreground truncate">{bookmark.url}</p>
                        </div>
                        {bookmark.folder && (
                          <Badge variant="secondary">{bookmark.folder}</Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => deleteBookmark(bookmark.id)}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">История</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Поиск в истории..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-xs"
                  />
                  <Button variant="outline" onClick={clearHistory}>
                    <Icon name="Trash2" size={16} className="mr-2" />
                    Очистить
                  </Button>
                </div>
              </div>
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {filteredHistory.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      onClick={() => {
                        setUrlInput(item.url);
                        navigateToUrl(item.url);
                      }}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Icon name="Clock" size={16} className="text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.title}</p>
                          <p className="text-sm text-muted-foreground truncate">{item.url}</p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {item.timestamp.toLocaleTimeString('ru-RU', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Настройки интерфейса</h3>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium">Тема</label>
                  <div className="flex gap-2">
                    <Button
                      variant={theme === 'light' ? 'default' : 'outline'}
                      onClick={() => setTheme('light')}
                      className="flex-1"
                    >
                      <Icon name="Sun" size={16} className="mr-2" />
                      Светлая
                    </Button>
                    <Button
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      onClick={() => setTheme('dark')}
                      className="flex-1"
                    >
                      <Icon name="Moon" size={16} className="mr-2" />
                      Темная
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Производительность</label>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Активных вкладок</span>
                      <Badge variant="secondary">{tabs.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Записей в истории</span>
                      <Badge variant="secondary">{history.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Закладок</span>
                      <Badge variant="secondary">{bookmarks.length}</Badge>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Настраиваемый браузер с фокусом на производительность и персонализацию
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Настройки браузера</DialogTitle>
            <DialogDescription>
              Персонализируйте интерфейс под свои предпочтения
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Тема оформления</label>
              <div className="flex gap-2">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  onClick={() => setTheme('light')}
                  className="flex-1"
                >
                  Светлая
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  onClick={() => setTheme('dark')}
                  className="flex-1"
                >
                  Темная
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Browser;
