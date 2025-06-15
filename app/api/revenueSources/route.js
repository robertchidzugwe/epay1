
export async function GET() {
    try {
      const res = await fetch("http://197.248.169.229:81/api/EpayFetcher/GetRevenueTypes");
  
      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }
  
      const data = await res.json();
      return Response.json(data);
    } catch (error) {
      return Response.json(
        { message: "Failed to fetch revenue sources", error: error.message },
        { status: 500 }
      );
    }
  }
  
  