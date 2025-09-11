'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Radio, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Globe,
  Wifi,
  Signal,
  BarChart3,
  Building,
  MapPin,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RadioStation {
  id: string;
  name: string;
  description: string;
  streamUrl: string;
  website?: string;
  country: string;
  language: string;
  genre: string;
  logo?: string;
  quality: 'Low' | 'Medium' | 'High' | 'HD';
}

const RADIO_STATIONS: Record<string, RadioStation[]> = {
  news: [
    {
      id: 'bbc-world-service',
      name: 'BBC World Service',
      description: 'Global news, current affairs and analysis',
      streamUrl: 'https://stream.live.vc.bbcmedia.co.uk/bbc_world_service',
      website: 'https://www.bbc.co.uk/sounds/play/live:bbc_world_service',
      country: 'UK',
      language: 'English',
      genre: 'News & Current Affairs',
      quality: 'HD'
    },
    {
      id: 'bbc-radio-4',
      name: 'BBC Radio 4',
      description: 'News, drama, comedy, science and history',
      streamUrl: 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_fourfm',
      website: 'https://www.bbc.co.uk/sounds/play/live:bbc_radio_four',
      country: 'UK',
      language: 'English',
      genre: 'News & Talk',
      quality: 'HD'
    },
    {
      id: 'bloomberg-radio',
      name: 'Bloomberg Radio',
      description: 'Business news, markets and financial analysis',
      streamUrl: 'https://www.bloomberg.com/audio/live/radio',
      website: 'https://www.bloomberg.com/audio',
      country: 'US',
      language: 'English',
      genre: 'Business & Finance',
      quality: 'High'
    },
    {
      id: 'bloomberg-tv-audio',
      name: 'Bloomberg TV Audio',
      description: 'Bloomberg Television audio feed',
      streamUrl: 'https://liveproduseast.akamaized.net/us/Channel-USTV-AWS-virginia-1/Source-USTV-1000-1_live.m3u8',
      country: 'US',
      language: 'English',
      genre: 'Business TV',
      quality: 'High'
    }
  ],
  local: [
    {
      id: 'joy-fm',
      name: 'Joy FM 99.7',
      description: 'Ghana\'s Leading Talk Radio Station',
      streamUrl: 'https://joyfmstream.com/joy997',
      website: 'https://www.myjoyonline.com',
      country: 'Ghana',
      language: 'English',
      genre: 'News & Talk',
      quality: 'High'
    },
    {
      id: 'citi-fm',
      name: 'Citi FM 97.3',
      description: 'Your Radio. Your News. Your Views.',
      streamUrl: 'https://citifmonline.com/live',
      website: 'https://citinewsroom.com',
      country: 'Ghana',
      language: 'English',
      genre: 'News & Current Affairs',
      quality: 'High'
    },
    {
      id: 'peace-fm',
      name: 'Peace FM 104.3',
      description: 'Ghana\'s Premium Radio Station',
      streamUrl: 'https://peacefmonline.com/radio',
      website: 'https://peacefmonline.com',
      country: 'Ghana',
      language: 'English/Twi',
      genre: 'News & Music',
      quality: 'High'
    },
    {
      id: 'starr-fm',
      name: 'Starr FM 103.5',
      description: 'Your Favourite Radio Station',
      streamUrl: 'https://starrfm.com.gh/live',
      website: 'https://starrfm.com.gh',
      country: 'Ghana',
      language: 'English',
      genre: 'Urban Contemporary',
      quality: 'High'
    },
    {
      id: 'metro-fm-ghana',
      name: 'Metro FM 94.1',
      description: 'Accra\'s Urban Music Station',
      streamUrl: 'https://metroradio.com.gh/stream',
      country: 'Ghana',
      language: 'English',
      genre: 'Hip Hop & R&B',
      quality: 'Medium'
    },
    {
      id: 'yfm-ghana',
      name: 'YFM 107.9',
      description: 'Ghana\'s Youth Radio Station',
      streamUrl: 'https://yfm.com.gh/live',
      website: 'https://yfm.com.gh',
      country: 'Ghana',
      language: 'English',
      genre: 'Youth & Music',
      quality: 'High'
    },
    {
      id: 'kfm-uganda',
      name: 'KFM 93.3',
      description: 'Uganda\'s Talk Radio Station',
      streamUrl: 'https://kfm.co.ug/live',
      website: 'https://kfm.co.ug',
      country: 'Uganda',
      language: 'English',
      genre: 'Talk Radio',
      quality: 'High'
    },
    {
      id: 'capital-fm-kenya',
      name: 'Capital FM 98.4',
      description: 'Kenya\'s Hit Music Station',
      streamUrl: 'https://capitalfm.co.ke/radio/live',
      website: 'https://capitalfm.co.ke',
      country: 'Kenya',
      language: 'English',
      genre: 'Contemporary Hits',
      quality: 'High'
    },
    {
      id: '947-south-africa',
      name: '947 Joburg',
      description: 'Joburg\'s Biggest Radio Station',
      streamUrl: 'https://947.co.za/live',
      website: 'https://947.co.za',
      country: 'South Africa',
      language: 'English',
      genre: 'Contemporary Music',
      quality: 'High'
    },
    {
      id: 'metro-fm-south-africa',
      name: 'Metro FM 104.9',
      description: 'South Africa\'s Urban Contemporary',
      streamUrl: 'https://metrofm.co.za/live',
      website: 'https://metrofm.co.za',
      country: 'South Africa',
      language: 'English',
      genre: 'Urban Contemporary',
      quality: 'High'
    },
    {
      id: 'radio-nigeria',
      name: 'Radio Nigeria 99.5 FM',
      description: 'Nigeria\'s National Radio',
      streamUrl: 'https://radionigeria.gov.ng/live',
      website: 'https://radionigeria.gov.ng',
      country: 'Nigeria',
      language: 'English',
      genre: 'News & Information',
      quality: 'Medium'
    },
    {
      id: 'wazobia-fm',
      name: 'Wazobia FM 95.1',
      description: 'Nigeria\'s No.1 Pidgin Radio Station',
      streamUrl: 'https://wazobiafm.com/live',
      website: 'https://wazobiafm.com',
      country: 'Nigeria',
      language: 'English/Pidgin',
      genre: 'Entertainment',
      quality: 'High'
    }
  ],
  international: [
    {
      id: 'france-inter',
      name: 'France Inter',
      description: 'French public radio',
      streamUrl: 'https://direct.franceinter.fr/live/franceinter-midfi.mp3',
      country: 'France',
      language: 'French',
      genre: 'Public Radio',
      quality: 'High'
    },
    {
      id: 'deutschlandfunk',
      name: 'Deutschlandfunk',
      description: 'German public broadcasting',
      streamUrl: 'https://st01.sslstream.dlf.de/dlf/01/128/mp3/stream.mp3',
      country: 'Germany',
      language: 'German',
      genre: 'News & Talk',
      quality: 'High'
    },
    {
      id: 'radio-canada',
      name: 'CBC Radio One',
      description: 'Canadian public radio',
      streamUrl: 'https://live-radio01.mediahub.ca/CBC_R1_TOR_H/playlist.m3u8',
      country: 'Canada',
      language: 'English',
      genre: 'Public Radio',
      quality: 'High'
    },
    {
      id: 'abc-news-radio',
      name: 'ABC News Radio Australia',
      description: 'Australian news and current affairs',
      streamUrl: 'https://live-radio02.mediahub.ca/ABC_NEWS/playlist.m3u8',
      country: 'Australia',
      language: 'English',
      genre: 'News',
      quality: 'High'
    }
  ]
};

interface OnlineRadioPlayerProps {
  showOnLanding?: boolean;
  compact?: boolean;
}

export function OnlineRadioPlayer({ showOnLanding = true, compact = false }: OnlineRadioPlayerProps) {
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('news');
  const [selectedStation, setSelectedStation] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Update current time
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString());
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Set default station
  useEffect(() => {
    if (!selectedStation && RADIO_STATIONS[selectedCategory]?.length > 0) {
      setSelectedStation(RADIO_STATIONS[selectedCategory][0]);
    }
  }, [selectedCategory, selectedStation]);

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      setIsLoading(false);
      setIsPlaying(false);
      toast({
        title: "Radio Stream Error",
        description: "Unable to connect to this station. Trying alternative stream...",
        variant: "destructive"
      });
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, [toast]);

  const handleStationSelect = (stationId: string) => {
    const station = RADIO_STATIONS[selectedCategory]?.find(s => s.id === stationId);
    if (station) {
      setSelectedStation(station);
      if (isPlaying) {
        setIsPlaying(false);
        setTimeout(() => playStation(station), 100);
      }
    }
  };

  const playStation = async (station: RadioStation) => {
    if (!audioRef.current) return;

    try {
      setIsLoading(true);
      audioRef.current.src = station.streamUrl;
      await audioRef.current.play();
      setIsPlaying(true);
      
      toast({
        title: `Now Playing: ${station.name}`,
        description: station.description,
      });
    } catch (error) {
      console.error('Error playing radio:', error);
      setIsPlaying(false);
      toast({
        title: "Playback Error",
        description: "Unable to play this radio station.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayPause = () => {
    if (!selectedStation || !audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      playStation(selectedStation);
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume[0] / 100;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'HD': return 'bg-green-500';
      case 'High': return 'bg-blue-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (compact) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Radio className="h-5 w-5" />
              Live Radio
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              <Signal className="h-3 w-3 mr-1" />
              {currentTime}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="news">BBC & Bloomberg</SelectItem>
                <SelectItem value="local">Ghana & African Stations</SelectItem>
                <SelectItem value="international">International</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              onClick={togglePlayPause}
              disabled={!selectedStation || isLoading}
              size="sm"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>
          
          {selectedStation && (
            <div className="text-sm">
              <div className="font-medium">{selectedStation.name}</div>
              <div className="text-muted-foreground">{selectedStation.description}</div>
            </div>
          )}
          
          <audio ref={audioRef} preload="none" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Radio className="h-6 w-6" />
          Live Online Radio
        </CardTitle>
        <CardDescription>
          Listen to BBC World Service, Bloomberg Radio, and Ghana & African stations worldwide
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Station Category Selection */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={selectedCategory === 'news' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('news')}
            className="text-xs"
          >
            <BarChart3 className="h-4 w-4 mr-1" />
            BBC & Bloomberg
          </Button>
          <Button
            variant={selectedCategory === 'local' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('local')}
            className="text-xs"
          >
            <MapPin className="h-4 w-4 mr-1" />
            Ghana & African
          </Button>
          <Button
            variant={selectedCategory === 'international' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('international')}
            className="text-xs"
          >
            <Globe className="h-4 w-4 mr-1" />
            International
          </Button>
        </div>

        {/* Station Selection */}
        <div className="space-y-3">
          <Select 
            value={selectedStation?.id || ''} 
            onValueChange={handleStationSelect}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a radio station" />
            </SelectTrigger>
            <SelectContent>
              {RADIO_STATIONS[selectedCategory]?.map((station) => (
                <SelectItem key={station.id} value={station.id}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{station.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {station.country}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Currently Selected Station Info */}
        {selectedStation && (
          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-semibold">{selectedStation.name}</h4>
                    <p className="text-sm text-muted-foreground">{selectedStation.description}</p>
                  </div>
                  <div className="flex gap-1">
                    <Badge variant="outline" className="text-xs">
                      {selectedStation.country}
                    </Badge>
                    <Badge variant="outline" className={`text-xs text-white ${getQualityColor(selectedStation.quality)}`}>
                      {selectedStation.quality}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    {selectedStation.genre}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Live • {currentTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Wifi className="h-3 w-3" />
                    Streaming
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Playback Controls */}
        <div className="flex items-center gap-4">
          <Button
            onClick={togglePlayPause}
            disabled={!selectedStation || isLoading}
            size="lg"
            className="flex-shrink-0"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
            <span className="ml-2">
              {isLoading ? 'Connecting...' : isPlaying ? 'Pause' : 'Play'}
            </span>
          </Button>

          {/* Volume Control */}
          <div className="flex items-center gap-2 flex-1">
            <Button variant="ghost" size="sm" onClick={toggleMute}>
              {isMuted || volume[0] === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Slider
              value={volume}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground w-8">
              {volume[0]}%
            </span>
          </div>
        </div>

        {/* Website Link */}
        {selectedStation?.website && (
          <div className="pt-2 border-t">
            <Button variant="link" size="sm" asChild>
              <a href={selectedStation.website} target="_blank" rel="noopener noreferrer">
                Visit {selectedStation.name} Website
              </a>
            </Button>
          </div>
        )}

        <audio ref={audioRef} preload="none" />
      </CardContent>
    </Card>
  );
}
