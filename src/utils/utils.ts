export const getArrayFlights = (flights: Record<string, unknown>[]) => flights
  .map((flight: any) => {
    let totalSegments = 0;
    const totalDuration = flight.flight.legs
      .reduce((acc: any, leg: any) => {
        totalSegments = totalSegments + leg.segments.length;
        return acc + leg.duration;
      }, 0);

    const legTo = flight.flight.legs[0].segments
      .reduce((acc: any, segment: any) => {
        acc.push(segment);
        return acc;
      }, []);

    const legFrom = flight.flight.legs[1].segments
      .reduce((acc: any, segment: any) => {
        acc.push(segment);
        return acc;
      }, []);

    const legFromflightNumber = legFrom
      .reduce((acc: string, legFromItem: any) => acc = acc + legFromItem.flightNumber, '');

    const legToflightNumber = legTo
      .reduce((acc: string, legToItem: any) => acc + legToItem.flightNumber, '');

    return {
      totalSegments,
      id: `${legFromflightNumber}${legToflightNumber}`,
      name: flight.flight.carrier.caption,
      price: flight.flight.price.total.amount,
      legTo,
      legFrom,
      totalDuration,
    };
  });
