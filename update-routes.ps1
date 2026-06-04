$routes = @("analyze", "screener", "options", "bot", "planner", "journal", "watchlist", "mf", "macro", "news", "learn", "tools", "darkpool", "backtester", "psychology", "terminal", "calendar")

$contentTemplate = @"
import { ComingSoon } from "@/components/layout/ComingSoon";

export default function {FunctionName}Page() {
  return (
    <ComingSoon 
      title="{Title}" 
      description="We're currently engineering this institutional-grade feature. Our quantitative models and data pipelines are being rigorously tested for upcoming deployment."
    />
  );
}
"@

foreach ($route in $routes) {
    $dirPath = "src\app\(dashboard)\$route"
    
    if (Test-Path $dirPath) {
        $title = (Get-Culture).TextInfo.ToTitleCase($route.ToLower())
        $funcName = $title -replace " ", ""
        
        $customContent = $contentTemplate -replace "{FunctionName}", $funcName -replace "{Title}", "$title Terminal"
        
        $pagePath = Join-Path $dirPath "page.tsx"
        Set-Content -Path $pagePath -Value $customContent
        Write-Host "Updated $pagePath"
    } else {
        Write-Host "Directory $dirPath does not exist, skipping."
    }
}
