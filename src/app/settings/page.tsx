
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { useTextSettings } from "@/hooks/use-text-settings";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SettingsPage() {
    const { fontSize, setFontSize, fontFace, setFontFace } = useTextSettings();

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                        <CardDescription>Customize the look and feel of the application.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <h3 className="text-lg font-medium">Theme</h3>
                                <p className="text-sm text-muted-foreground">Select a theme for the dashboard.</p>
                            </div>
                            <ThemeSwitcher />
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Text</CardTitle>
                        <CardDescription>Adjust text size and font style for better readability.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="p-4 border rounded-lg space-y-4">
                            <div>
                                <Label htmlFor="font-size" className="text-lg font-medium">Font Size</Label>
                                <div className="flex items-center gap-4 mt-2">
                                    <Slider
                                        id="font-size"
                                        min={12}
                                        max={24}
                                        step={1}
                                        value={[fontSize]}
                                        onValueChange={(value) => setFontSize(value[0])}
                                    />
                                    <span className="text-sm font-medium text-muted-foreground w-12 text-center">{fontSize}px</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border rounded-lg space-y-4">
                             <div>
                                <Label htmlFor="font-face" className="text-lg font-medium">Font Family</Label>
                                <Select onValueChange={(value) => setFontFace(value as any)} value={fontFace}>
                                    <SelectTrigger className="mt-2">
                                        <SelectValue placeholder="Select a font" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="inter">Inter (Default)</SelectItem>
                                        <SelectItem value="roboto">Roboto</SelectItem>
                                        <SelectItem value="lato">Lato</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
