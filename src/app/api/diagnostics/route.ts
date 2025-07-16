import { NextResponse } from 'next/server';
import { runNetworkDiagnostics, formatDiagnosticsReport } from '@/lib/diagnostics';

export async function GET() {
  try {
    console.log('Running network diagnostics...');

    const apiKey = process.env.GOOGLE_API_KEY?.trim();
    const diagnostics = await runNetworkDiagnostics(apiKey);

    const report = formatDiagnosticsReport(diagnostics);
    console.log('\n' + report);

    return NextResponse.json({
      success: diagnostics.overall,
      diagnostics,
      report,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Diagnostics error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to run diagnostics',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
