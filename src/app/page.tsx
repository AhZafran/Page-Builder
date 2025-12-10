import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="text-center px-4">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Page Builder
        </h1>
        <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
          Create beautiful landing pages with our drag-and-drop editor
        </p>
        <Link href="/editor">
          <Button size="lg" className="gap-2">
            Start Building
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
